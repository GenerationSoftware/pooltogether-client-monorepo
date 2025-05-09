import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useSend5792DepositZapTransaction,
  useSendDepositZapTransaction,
  useSendGenericApproveTransaction,
  useToken,
  useTokenAllowance,
  useTokenBalance,
  useUserVaultDelegationBalance,
  useUserVaultTokenBalance,
  useVaultBalance,
  useVaultTokenAddress
} from '@generationsoftware/hyperstructure-react-hooks'
import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { useMiscSettings } from '@shared/generic-react-hooks'
import { ApprovalTooltip, TransactionButton } from '@shared/react-components'
import { Button } from '@shared/ui'
import { DOLPHIN_ADDRESS, lower, supportsEip5792, ZAP_SETTINGS } from '@shared/utilities'
import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { Hash, isAddress, parseUnits } from 'viem'
import { useAccount, useCapabilities } from 'wagmi'
import { PAYMASTER_URLS } from '@constants/config'
import { DepositModalView } from '.'
import { isValidFormInput } from '../TxFormInput'
import { depositFormTokenAddressAtom, depositFormTokenAmountAtom } from './DepositForm'

interface DepositZapTxButtonProps {
  vault: Vault
  modalView: string
  setModalView: (view: DepositModalView) => void
  setDepositTxHash: (txHash: string) => void
  refetchUserBalances?: () => void
  onSuccessfulApproval?: () => void
  onSuccessfulDepositWithZap?: (chainId: number, txHash: Hash) => void
}

export const DepositZapTxButton = (props: DepositZapTxButtonProps) => {
  const {
    vault,
    modalView,
    setModalView,
    setDepositTxHash,
    refetchUserBalances,
    onSuccessfulApproval,
    onSuccessfulDepositWithZap
  } = props

  const t_common = useTranslations('Common')
  const t_modals = useTranslations('TxModals')
  const t_tooltips = useTranslations('Tooltips')

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

  const { address: userAddress, chain, isDisconnected } = useAccount()

  const formInputTokenAddress = useAtomValue(depositFormTokenAddressAtom)

  const { data: vaultTokenAddress } = useVaultTokenAddress(vault)

  const inputTokenAddress =
    !!formInputTokenAddress && isAddress(formInputTokenAddress)
      ? formInputTokenAddress
      : vaultTokenAddress

  const { data: inputToken } = useToken(vault.chainId, inputTokenAddress!)

  const zapTokenManagerAddress = ZAP_SETTINGS[vault.chainId]?.zapTokenManager

  const {
    data: allowance,
    isFetched: isFetchedAllowance,
    refetch: refetchTokenAllowance
  } = useTokenAllowance(vault.chainId, userAddress!, zapTokenManagerAddress, inputToken?.address!)

  const {
    data: userInputTokenBalance,
    isFetched: isFetchedUserInputTokenBalance,
    refetch: refetchUserInputTokenBalance
  } = useTokenBalance(vault.chainId, userAddress!, inputToken?.address!)

  const { refetch: refetchUserVaultTokenBalance } = useUserVaultTokenBalance(vault, userAddress!)

  const { refetch: refetchUserVaultDelegationBalance } = useUserVaultDelegationBalance(
    vault,
    userAddress!
  )

  const { refetch: refetchVaultBalance } = useVaultBalance(vault)

  const formInputTokenAmount = useAtomValue(depositFormTokenAmountAtom)

  const isValidFormInputTokenAmount =
    !!inputToken && inputToken.decimals !== undefined
      ? isValidFormInput(formInputTokenAmount, inputToken.decimals)
      : false

  const depositAmount = isValidFormInputTokenAmount
    ? parseUnits(formInputTokenAmount, inputToken?.decimals!)
    : 0n

  const {
    isWaiting: isWaitingApproval,
    isConfirming: isConfirmingApproval,
    isSuccess: isSuccessfulApproval,
    txHash: approvalTxHash,
    sendApproveTransaction: sendApproveTransaction
  } = useSendGenericApproveTransaction(
    vault.chainId,
    inputToken?.address!,
    zapTokenManagerAddress,
    depositAmount,
    {
      onSuccess: () => {
        refetchTokenAllowance()
        onSuccessfulApproval?.()
      }
    }
  )

  const dataTx = useSendDepositZapTransaction(
    {
      address: inputToken?.address!,
      decimals: inputToken?.decimals!,
      amount: depositAmount
    },
    vault,
    {
      onSend: () => {
        setModalView('waiting')
      },
      onSuccess: (txReceipt) => {
        refetchUserInputTokenBalance()
        refetchUserVaultTokenBalance()
        refetchUserVaultDelegationBalance()
        refetchVaultBalance()
        refetchTokenAllowance()
        refetchUserBalances?.()
        onSuccessfulDepositWithZap?.(vault.chainId, txReceipt.transactionHash)
        setModalView('success')
      },
      onError: () => {
        setModalView('error')
      }
    }
  )

  const { data: walletCapabilities } = useCapabilities()
  const { isActive: isEip5792Disabled } = useMiscSettings('eip5792Disabled')
  const isUsingEip5792 =
    supportsEip5792(walletCapabilities?.[vault.chainId] ?? {}) && !isEip5792Disabled
  const paymasterUrl = PAYMASTER_URLS[vault.chainId]

  const data5792Tx = useSend5792DepositZapTransaction(
    {
      address: inputToken?.address!,
      decimals: inputToken?.decimals!,
      amount: depositAmount
    },
    vault,
    {
      paymasterService: !!paymasterUrl ? { url: paymasterUrl, optional: true } : undefined,
      onSend: () => {
        setModalView('waiting')
      },
      onSuccess: (callReceipts) => {
        refetchUserInputTokenBalance()
        refetchUserVaultTokenBalance()
        refetchUserVaultDelegationBalance()
        refetchVaultBalance()
        refetchTokenAllowance()
        refetchUserBalances?.()
        onSuccessfulDepositWithZap?.(vault.chainId, callReceipts.at(-1)?.transactionHash!)
        setModalView('success')
      },
      onError: () => {
        setModalView('error')
      },
      enabled: isUsingEip5792
    }
  )

  const sendTx = isUsingEip5792
    ? data5792Tx.send5792DepositZapTransaction
    : dataTx.sendDepositZapTransaction
  const isWaitingDepositZap = isUsingEip5792 ? data5792Tx.isWaiting : dataTx.isWaiting
  const isConfirmingDepositZap = isUsingEip5792 ? data5792Tx.isConfirming : dataTx.isConfirming
  const isSuccessfulDepositZap = isUsingEip5792 ? data5792Tx.isSuccess : dataTx.isSuccess
  const depositZapTxHash = isUsingEip5792 ? data5792Tx.txHashes?.at(-1) : dataTx.txHash
  const amountOut = isUsingEip5792 ? data5792Tx.amountOut : dataTx.amountOut
  const isFetchedZapArgs = isUsingEip5792 ? data5792Tx.isFetchedZapArgs : dataTx.isFetchedZapArgs
  const isFetchingZapArgs = isUsingEip5792 ? data5792Tx.isFetchingZapArgs : dataTx.isFetchingZapArgs

  useEffect(() => {
    if (
      !!depositZapTxHash &&
      isConfirmingDepositZap &&
      !isWaitingDepositZap &&
      !isSuccessfulDepositZap
    ) {
      setDepositTxHash(depositZapTxHash)
      setModalView('confirming')
    }
  }, [depositZapTxHash, isConfirmingDepositZap])

  const isDataFetched =
    !isDisconnected &&
    !!userAddress &&
    !!inputTokenAddress &&
    !!inputToken &&
    isFetchedUserInputTokenBalance &&
    !!userInputTokenBalance &&
    isFetchedAllowance &&
    allowance !== undefined &&
    !!depositAmount &&
    inputToken.decimals !== undefined &&
    chain?.id === vault.chainId &&
    isFetchedZapArgs

  const approvalEnabled =
    isDataFetched && userInputTokenBalance.amount >= depositAmount && isValidFormInputTokenAmount

  const depositEnabled =
    isDataFetched &&
    userInputTokenBalance.amount >= depositAmount &&
    (lower(inputTokenAddress) === DOLPHIN_ADDRESS ||
      isUsingEip5792 ||
      allowance >= depositAmount) &&
    isValidFormInputTokenAmount

  // No deposit amount set
  if (depositAmount === 0n) {
    return (
      <Button color='transparent' fullSized={true} disabled={true}>
        {t_modals('enterAnAmount')}
      </Button>
    )
  }

  // Needs approval
  if (
    isDataFetched &&
    lower(inputTokenAddress) !== DOLPHIN_ADDRESS &&
    !isUsingEip5792 &&
    allowance < depositAmount
  ) {
    return (
      <TransactionButton
        chainId={vault.chainId}
        isTxLoading={isWaitingApproval || isConfirmingApproval}
        isTxSuccess={isSuccessfulApproval}
        write={sendApproveTransaction}
        txHash={approvalTxHash}
        txDescription={t_modals('approvalTx', { symbol: inputToken?.symbol ?? '?' })}
        fullSized={true}
        disabled={!approvalEnabled}
        openConnectModal={openConnectModal}
        openChainModal={openChainModal}
        addRecentTransaction={addRecentTransaction}
        innerClassName='flex gap-2 items-center'
        intl={{ base: t_modals, common: t_common }}
      >
        {t_modals('approvalButton', { symbol: inputToken?.symbol ?? '?' })}
        <ApprovalTooltip
          tokenSymbol={inputToken.symbol}
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

  // Fetching zap args
  if (isFetchingZapArgs) {
    return (
      <Button fullSized={true} disabled={true}>
        {t_modals('findingZapRoute')}
      </Button>
    )
  }

  // Zap route unavailable
  if (!isFetchingZapArgs && !amountOut) {
    return (
      <Button fullSized={true} disabled={true}>
        {t_modals('noZapRouteFound')}
      </Button>
    )
  }

  // Deposit button
  return (
    <TransactionButton
      chainId={vault.chainId}
      isTxLoading={isWaitingDepositZap || isConfirmingDepositZap}
      isTxSuccess={isSuccessfulDepositZap}
      write={sendTx}
      txHash={depositZapTxHash}
      txDescription={t_modals('depositTx', { symbol: inputToken?.symbol ?? '?' })}
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
