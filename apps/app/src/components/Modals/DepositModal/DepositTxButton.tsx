import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useSend5792DepositTransaction,
  useSendApproveTransaction,
  useSendDepositTransaction,
  useTokenAllowance,
  useTokenBalance,
  useUserVaultDelegationBalance,
  useUserVaultTokenBalance,
  useVaultBalance,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { useMiscSettings } from '@shared/generic-react-hooks'
import { ApprovalTooltip, TransactionButton } from '@shared/react-components'
import { Button } from '@shared/ui'
import { supportsEip5792, supportsEip7677 } from '@shared/utilities'
import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { Address, Hash, parseUnits } from 'viem'
import { useAccount, useCapabilities } from 'wagmi'
import { PAYMASTER_URLS } from '@constants/config'
import { DepositModalView } from '.'
import { isValidFormInput } from '../TxFormInput'
import { depositFormTokenAmountAtom } from './DepositForm'

interface DepositTxButtonProps {
  vault: Vault
  modalView: string
  setModalView: (view: DepositModalView) => void
  setDepositTxHash: (txHash: string) => void
  refetchUserBalances?: () => void
  onSuccessfulApproval?: () => void
  onSuccessfulDeposit?: (chainId: number, txHash: Hash) => void
}

export const DepositTxButton = (props: DepositTxButtonProps) => {
  const {
    vault,
    modalView,
    setModalView,
    setDepositTxHash,
    refetchUserBalances,
    onSuccessfulApproval,
    onSuccessfulDeposit
  } = props

  const t_common = useTranslations('Common')
  const t_modals = useTranslations('TxModals')
  const t_tooltips = useTranslations('Tooltips')

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

  const { address: userAddress, chain, isDisconnected } = useAccount()

  const { data: tokenData } = useVaultTokenData(vault)
  const decimals = vault.decimals ?? tokenData?.decimals

  const {
    data: allowance,
    isFetched: isFetchedAllowance,
    refetch: refetchTokenAllowance
  } = useTokenAllowance(
    vault.chainId,
    userAddress as Address,
    vault.address,
    tokenData?.address as Address
  )

  const {
    data: userTokenBalance,
    isFetched: isFetchedUserTokenBalance,
    refetch: refetchUserTokenBalance
  } = useTokenBalance(vault.chainId, userAddress as Address, tokenData?.address as Address)

  const { refetch: refetchUserVaultTokenBalance } = useUserVaultTokenBalance(
    vault,
    userAddress as Address
  )

  const { refetch: refetchUserVaultDelegationBalance } = useUserVaultDelegationBalance(
    vault,
    userAddress as Address
  )

  const { refetch: refetchVaultBalance } = useVaultBalance(vault)

  const formTokenAmount = useAtomValue(depositFormTokenAmountAtom)

  const isValidFormTokenAmount =
    decimals !== undefined ? isValidFormInput(formTokenAmount, decimals) : false

  const depositAmount = isValidFormTokenAmount
    ? parseUnits(formTokenAmount, decimals as number)
    : 0n

  const {
    isWaiting: isWaitingApproval,
    isConfirming: isConfirmingApproval,
    isSuccess: isSuccessfulApproval,
    txHash: approvalTxHash,
    sendApproveTransaction: sendApproveTransaction
  } = useSendApproveTransaction(depositAmount, vault, {
    onSuccess: () => {
      refetchTokenAllowance()
      onSuccessfulApproval?.()
    }
  })

  const dataDepositTx = useSendDepositTransaction(depositAmount, vault, {
    onSend: () => {
      setModalView('waiting')
    },
    onSuccess: (txReceipt) => {
      refetchUserTokenBalance()
      refetchUserVaultTokenBalance()
      refetchUserVaultDelegationBalance()
      refetchVaultBalance()
      refetchTokenAllowance()
      refetchUserBalances?.()
      onSuccessfulDeposit?.(vault.chainId, txReceipt.transactionHash)
      setModalView('success')
    },
    onError: () => {
      setModalView('error')
    }
  })

  const { data: walletCapabilities } = useCapabilities()
  const chainWalletCapabilities = walletCapabilities?.[vault.chainId] ?? {}

  const { isActive: isEip5792Disabled } = useMiscSettings('eip5792Disabled')
  const isUsingEip5792 = supportsEip5792(chainWalletCapabilities) && !isEip5792Disabled

  const { isActive: isEip7677Disabled } = useMiscSettings('eip7677Disabled')
  const paymasterUrl = PAYMASTER_URLS[vault.chainId]
  const isUsingEip7677 =
    !!paymasterUrl && supportsEip7677(chainWalletCapabilities) && !isEip7677Disabled

  const data5792DepositTx = useSend5792DepositTransaction(depositAmount, vault, {
    paymasterService: isUsingEip7677 ? { url: paymasterUrl, optional: true } : undefined,
    onSend: () => {
      setModalView('waiting')
    },
    onSuccess: (callReceipts) => {
      refetchUserTokenBalance()
      refetchUserVaultTokenBalance()
      refetchUserVaultDelegationBalance()
      refetchVaultBalance()
      refetchTokenAllowance()
      refetchUserBalances?.()
      onSuccessfulDeposit?.(vault.chainId, callReceipts.at(-1)?.transactionHash!)
      setModalView('success')
    },
    onError: () => {
      setModalView('error')
    },
    enabled: isUsingEip5792
  })

  const isWaitingDeposit = isUsingEip5792 ? data5792DepositTx.isWaiting : dataDepositTx.isWaiting
  const isConfirmingDeposit = isUsingEip5792
    ? data5792DepositTx.isConfirming
    : dataDepositTx.isConfirming
  const isSuccessfulDeposit = isUsingEip5792 ? data5792DepositTx.isSuccess : dataDepositTx.isSuccess
  const depositTxHash = isUsingEip5792 ? data5792DepositTx.txHashes?.at(-1) : dataDepositTx.txHash
  const sendDepositTransaction = isUsingEip5792
    ? data5792DepositTx.send5792DepositTransaction
    : dataDepositTx.sendDepositTransaction

  useEffect(() => {
    if (!!depositTxHash && isConfirmingDeposit && !isWaitingDeposit && !isSuccessfulDeposit) {
      setDepositTxHash(depositTxHash)
      setModalView('confirming')
    }
  }, [depositTxHash, isConfirmingDeposit])

  const isDataFetched =
    !isDisconnected &&
    !!userAddress &&
    !!tokenData &&
    isFetchedUserTokenBalance &&
    !!userTokenBalance &&
    isFetchedAllowance &&
    allowance !== undefined &&
    !!depositAmount &&
    decimals !== undefined &&
    chain?.id === vault.chainId

  const approvalEnabled =
    isDataFetched && userTokenBalance.amount >= depositAmount && isValidFormTokenAmount

  const depositEnabled =
    isDataFetched &&
    userTokenBalance.amount >= depositAmount &&
    (isUsingEip5792 || allowance >= depositAmount) &&
    isValidFormTokenAmount

  // No deposit amount set
  if (depositAmount === 0n) {
    return (
      <Button color='transparent' fullSized={true} disabled={true}>
        {t_modals('enterAnAmount')}
      </Button>
    )
  }

  // Needs approval
  if (isDataFetched && !isUsingEip5792 && allowance < depositAmount) {
    return (
      <TransactionButton
        chainId={vault.chainId}
        isTxLoading={isWaitingApproval || isConfirmingApproval}
        isTxSuccess={isSuccessfulApproval}
        write={sendApproveTransaction}
        txHash={approvalTxHash}
        txDescription={t_modals('approvalTx', { symbol: tokenData?.symbol ?? '?' })}
        fullSized={true}
        disabled={!approvalEnabled}
        openConnectModal={openConnectModal}
        openChainModal={openChainModal}
        addRecentTransaction={addRecentTransaction}
        innerClassName='flex gap-2 items-center'
        intl={{ base: t_modals, common: t_common }}
      >
        {t_modals('approvalButton', { symbol: tokenData?.symbol ?? '?' })}
        <ApprovalTooltip
          tokenSymbol={tokenData.symbol}
          intl={t_tooltips}
          className='whitespace-normal'
        />
      </TransactionButton>
    )
  }

  // Prompt to review deposit
  if (isDataFetched && modalView === 'main') {
    return (
      <Button onClick={() => setModalView('review')} fullSized={true} disabled={!depositEnabled}>
        {t_modals('reviewDeposit')}
      </Button>
    )
  }

  // Deposit button
  return (
    <TransactionButton
      chainId={vault.chainId}
      isTxLoading={isWaitingDeposit || isConfirmingDeposit}
      isTxSuccess={isSuccessfulDeposit}
      write={sendDepositTransaction}
      txHash={depositTxHash}
      txDescription={t_modals('depositTx', { symbol: tokenData?.symbol ?? '?' })}
      fullSized={true}
      disabled={!depositEnabled}
      openConnectModal={openConnectModal}
      openChainModal={openChainModal}
      addRecentTransaction={addRecentTransaction}
      intl={{ base: t_modals, common: t_common }}
    >
      {t_modals('confirmDeposit')}
    </TransactionButton>
  )
}
