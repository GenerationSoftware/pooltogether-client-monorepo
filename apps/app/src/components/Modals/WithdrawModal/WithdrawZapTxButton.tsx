import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useSend5792WithdrawZapTransaction,
  useSendGenericApproveTransaction,
  useSendWithdrawZapTransaction,
  useToken,
  useTokenAllowance,
  useTokenBalance,
  useUserVaultDelegationBalance,
  useUserVaultShareBalance,
  useUserVaultTokenBalance,
  useVaultBalance,
  useVaultShareData,
  useVaultTokenAddress
} from '@generationsoftware/hyperstructure-react-hooks'
import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { useMiscSettings } from '@shared/generic-react-hooks'
import { ApprovalTooltip, TransactionButton } from '@shared/react-components'
import { Button } from '@shared/ui'
import { supportsEip5792, ZAP_SETTINGS } from '@shared/utilities'
import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { isAddress, parseUnits } from 'viem'
import { useAccount, useCapabilities } from 'wagmi'
import { PAYMASTER_URLS } from '@constants/config'
import { WithdrawModalView } from '.'
import { isValidFormInput } from '../TxFormInput'
import { withdrawFormShareAmountAtom, withdrawFormTokenAddressAtom } from './WithdrawForm'

interface WithdrawZapTxButtonProps {
  vault: Vault
  modalView: string
  setModalView: (view: WithdrawModalView) => void
  setWithdrawTxHash: (txHash: string) => void
  refetchUserBalances?: () => void
  onSuccessfulApproval?: () => void
  onSuccessfulWithdrawalWithZap?: () => void
}

export const WithdrawZapTxButton = (props: WithdrawZapTxButtonProps) => {
  const {
    vault,
    modalView,
    setModalView,
    setWithdrawTxHash,
    refetchUserBalances,
    onSuccessfulApproval,
    onSuccessfulWithdrawalWithZap
  } = props

  const t_common = useTranslations('Common')
  const t_modals = useTranslations('TxModals')
  const t_tooltips = useTranslations('Tooltips')

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

  const { address: userAddress, chain, isDisconnected } = useAccount()

  const formOutputTokenAddress = useAtomValue(withdrawFormTokenAddressAtom)

  const { data: share } = useVaultShareData(vault)

  const { data: vaultTokenAddress } = useVaultTokenAddress(vault)

  const outputTokenAddress =
    !!formOutputTokenAddress && isAddress(formOutputTokenAddress)
      ? formOutputTokenAddress
      : vaultTokenAddress

  const { data: outputToken } = useToken(vault.chainId, outputTokenAddress!)

  const zapTokenManagerAddress = ZAP_SETTINGS[vault.chainId]?.zapTokenManager

  const {
    data: allowance,
    isFetched: isFetchedAllowance,
    refetch: refetchTokenAllowance
  } = useTokenAllowance(vault.chainId, userAddress!, zapTokenManagerAddress, vault.address)

  const { data: userVaultShareBalance, isFetched: isFetchedUserVaultShareBalance } =
    useUserVaultShareBalance(vault, userAddress!)

  const {
    data: userOutputTokenBalance,
    isFetched: isFetchedUserOutputTokenBalance,
    refetch: refetchUserOutputTokenBalance
  } = useTokenBalance(vault.chainId, userAddress!, outputToken?.address!)

  const { refetch: refetchUserVaultTokenBalance } = useUserVaultTokenBalance(vault, userAddress!)

  const { refetch: refetchUserVaultDelegationBalance } = useUserVaultDelegationBalance(
    vault,
    userAddress!
  )

  const { refetch: refetchVaultBalance } = useVaultBalance(vault)

  const formShareAmount = useAtomValue(withdrawFormShareAmountAtom)

  const isValidFormShareAmount =
    vault.decimals !== undefined ? isValidFormInput(formShareAmount, vault.decimals) : false

  const withdrawAmount = isValidFormShareAmount ? parseUnits(formShareAmount, vault.decimals!) : 0n

  const {
    isWaiting: isWaitingApproval,
    isConfirming: isConfirmingApproval,
    isSuccess: isSuccessfulApproval,
    txHash: approvalTxHash,
    sendApproveTransaction: sendApproveTransaction
  } = useSendGenericApproveTransaction(
    vault.chainId,
    vault.address,
    zapTokenManagerAddress,
    withdrawAmount,
    {
      onSuccess: () => {
        refetchTokenAllowance()
        onSuccessfulApproval?.()
      }
    }
  )

  const dataTx = useSendWithdrawZapTransaction(
    { address: outputToken?.address!, decimals: outputToken?.decimals! },
    vault,
    withdrawAmount,
    {
      onSend: () => {
        setModalView('waiting')
      },
      onSuccess: () => {
        refetchUserOutputTokenBalance()
        refetchUserVaultTokenBalance()
        refetchUserVaultDelegationBalance()
        refetchVaultBalance()
        refetchTokenAllowance()
        refetchUserBalances?.()
        onSuccessfulWithdrawalWithZap?.()
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

  const data5792Tx = useSend5792WithdrawZapTransaction(
    { address: outputToken?.address!, decimals: outputToken?.decimals! },
    vault,
    withdrawAmount,
    {
      paymasterService: !!paymasterUrl ? { url: paymasterUrl, optional: true } : undefined,
      onSend: () => {
        setModalView('waiting')
      },
      onSuccess: () => {
        refetchUserOutputTokenBalance()
        refetchUserVaultTokenBalance()
        refetchUserVaultDelegationBalance()
        refetchVaultBalance()
        refetchTokenAllowance()
        refetchUserBalances?.()
        onSuccessfulWithdrawalWithZap?.()
        setModalView('success')
      },
      onError: () => {
        setModalView('error')
      },
      enabled: isUsingEip5792
    }
  )

  const sendTx = isUsingEip5792
    ? data5792Tx.send5792WithdrawZapTransaction
    : dataTx.sendWithdrawZapTransaction
  const isWaitingWithdrawZap = isUsingEip5792 ? data5792Tx.isWaiting : dataTx.isWaiting
  const isConfirmingWithdrawZap = isUsingEip5792 ? data5792Tx.isConfirming : dataTx.isConfirming
  const isSuccessfulWithdrawZap = isUsingEip5792 ? data5792Tx.isSuccess : dataTx.isSuccess
  const withdrawZapTxHash = isUsingEip5792 ? data5792Tx.txHashes?.at(-1) : dataTx.txHash
  const amountOut = isUsingEip5792 ? data5792Tx.amountOut : dataTx.amountOut
  const isFetchedZapArgs = isUsingEip5792 ? data5792Tx.isFetchedZapArgs : dataTx.isFetchedZapArgs
  const isFetchingZapArgs = isUsingEip5792 ? data5792Tx.isFetchingZapArgs : dataTx.isFetchingZapArgs

  useEffect(() => {
    if (
      !!withdrawZapTxHash &&
      isConfirmingWithdrawZap &&
      !isWaitingWithdrawZap &&
      !isSuccessfulWithdrawZap
    ) {
      setWithdrawTxHash(withdrawZapTxHash)
      setModalView('confirming')
    }
  }, [withdrawZapTxHash, isConfirmingWithdrawZap])

  const isDataFetched =
    !isDisconnected &&
    !!userAddress &&
    !!share &&
    !!outputTokenAddress &&
    !!outputToken &&
    isFetchedUserVaultShareBalance &&
    !!userVaultShareBalance &&
    isFetchedUserOutputTokenBalance &&
    userOutputTokenBalance !== undefined &&
    isFetchedAllowance &&
    allowance !== undefined &&
    !!withdrawAmount &&
    outputToken.decimals !== undefined &&
    chain?.id === vault.chainId &&
    isFetchedZapArgs

  const approvalEnabled =
    isDataFetched && userVaultShareBalance.amount >= withdrawAmount && isValidFormShareAmount

  const withdrawEnabled =
    isDataFetched &&
    userVaultShareBalance.amount >= withdrawAmount &&
    (isUsingEip5792 || allowance >= withdrawAmount) &&
    isValidFormShareAmount

  // No withdraw amount set
  if (withdrawAmount === 0n) {
    return (
      <Button color='transparent' fullSized={true} disabled={true}>
        {t_modals('enterAnAmount')}
      </Button>
    )
  }

  // Needs approval
  if (isDataFetched && !isUsingEip5792 && allowance < withdrawAmount) {
    return (
      <TransactionButton
        chainId={vault.chainId}
        isTxLoading={isWaitingApproval || isConfirmingApproval}
        isTxSuccess={isSuccessfulApproval}
        write={sendApproveTransaction}
        txHash={approvalTxHash}
        txDescription={t_modals('approvalTx', { symbol: share.symbol ?? '?' })}
        fullSized={true}
        disabled={!approvalEnabled}
        openConnectModal={openConnectModal}
        openChainModal={openChainModal}
        addRecentTransaction={addRecentTransaction}
        innerClassName='flex gap-2 items-center'
        intl={{ base: t_modals, common: t_common }}
      >
        {t_modals('approvalButton', { symbol: share.symbol ?? '?' })}
        <ApprovalTooltip
          tokenSymbol={share.symbol}
          intl={t_tooltips}
          className='whitespace-normal'
        />
      </TransactionButton>
    )
  }

  // Prompt to review withdrawal
  if (isDataFetched && modalView === 'main') {
    return (
      <Button onClick={() => setModalView('review')} fullSized={true} disabled={!withdrawEnabled}>
        {t_modals('reviewWithdrawal')}
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

  // Withdraw button
  return (
    <TransactionButton
      chainId={vault.chainId}
      isTxLoading={isWaitingWithdrawZap || isConfirmingWithdrawZap}
      isTxSuccess={isSuccessfulWithdrawZap}
      write={sendTx}
      txHash={withdrawZapTxHash}
      txDescription={t_modals('withdrawTx', { symbol: share?.symbol ?? '?' })}
      fullSized={true}
      disabled={!withdrawEnabled}
      openConnectModal={openConnectModal}
      openChainModal={openChainModal}
      addRecentTransaction={addRecentTransaction}
      intl={{ base: t_modals, common: t_common }}
    >
      {t_modals('confirmWithdrawal')}
    </TransactionButton>
  )
}
