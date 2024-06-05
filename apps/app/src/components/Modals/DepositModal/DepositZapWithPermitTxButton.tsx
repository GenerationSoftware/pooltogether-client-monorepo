import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useGenericApproveSignature,
  useToken,
  useTokenAllowance,
  useTokenBalance,
  useUserVaultDelegationBalance,
  useUserVaultTokenBalance,
  useVaultBalance,
  useVaultTokenAddress
} from '@generationsoftware/hyperstructure-react-hooks'
import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { TransactionButton } from '@shared/react-components'
import { Button } from '@shared/ui'
import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { Address, isAddress, parseUnits, TransactionReceipt } from 'viem'
import { useAccount } from 'wagmi'
import { ZAP_SETTINGS } from '@constants/config'
import { useSendDepositZapTransaction } from '@hooks/useSendDepositZapTransaction'
import { useSendDepositZapWithPermitTransaction } from '@hooks/useSendDepositZapWithPermitTransaction'
import { DepositModalView } from '.'
import { isValidFormInput } from '../TxFormInput'
import { depositFormTokenAddressAtom, depositFormTokenAmountAtom } from './DepositForm'

interface DepositZapWithPermitTxButtonProps {
  vault: Vault
  modalView: string
  setModalView: (view: DepositModalView) => void
  setDepositTxHash: (txHash: string) => void
  refetchUserBalances?: () => void
  onSuccessfulDeposit?: (chainId: number, txReceipt: TransactionReceipt) => void
  onSuccessfulDepositWithPermit?: (chainId: number, txReceipt: TransactionReceipt) => void
}

export const DepositZapWithPermitTxButton = (props: DepositZapWithPermitTxButtonProps) => {
  const {
    vault,
    modalView,
    setModalView,
    setDepositTxHash,
    refetchUserBalances,
    onSuccessfulDeposit,
    onSuccessfulDepositWithPermit
  } = props

  const t_common = useTranslations('Common')
  const t_modals = useTranslations('TxModals')

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

  const { data: inputToken } = useToken(vault.chainId, inputTokenAddress as Address)

  const zapTokenManager = ZAP_SETTINGS[vault.chainId]?.zapTokenManager

  const {
    data: allowance,
    isFetched: isFetchedAllowance,
    refetch: refetchTokenAllowance
  } = useTokenAllowance(
    vault.chainId,
    userAddress as Address,
    zapTokenManager,
    inputToken?.address as Address
  )

  const {
    data: userInputTokenBalance,
    isFetched: isFetchedUserInputTokenBalance,
    refetch: refetchUserInputTokenBalance
  } = useTokenBalance(vault.chainId, userAddress as Address, inputToken?.address as Address)

  const { refetch: refetchUserVaultTokenBalance } = useUserVaultTokenBalance(
    vault,
    userAddress as Address
  )

  const { refetch: refetchUserVaultDelegationBalance } = useUserVaultDelegationBalance(
    vault,
    userAddress as Address
  )

  const { refetch: refetchVaultBalance } = useVaultBalance(vault)

  const formInputTokenAmount = useAtomValue(depositFormTokenAmountAtom)

  const isValidFormInputTokenAmount =
    !!inputToken && inputToken.decimals !== undefined
      ? isValidFormInput(formInputTokenAmount, inputToken.decimals)
      : false

  const depositAmount = isValidFormInputTokenAmount
    ? parseUnits(formInputTokenAmount, inputToken?.decimals as number)
    : 0n

  const [isApproved, setIsApproved] = useState<boolean>(false)
  const [isReadyToSendTxAfterSigning, setIsReadyToSendTxAfterSigning] = useState<boolean>(false)

  // TODO: the zap contract requires Permit2 signatures, not 2612
  const {
    signature,
    deadline,
    nonce,
    isWaiting: isWaitingApproval,
    signApprove
  } = useGenericApproveSignature(
    { chainId: vault.chainId, address: inputTokenAddress as Address, amount: depositAmount },
    zapTokenManager,
    {
      onSuccess: () => {
        setIsApproved(true)
        setIsReadyToSendTxAfterSigning(true)
      },
      onError: () => setModalView('error')
    }
  )

  const {
    isWaiting: isWaitingDepositZapWithPermit,
    isConfirming: isConfirmingDepositZapWithPermit,
    isSuccess: isSuccessfulDepositZapWithPermit,
    txHash: depositZapWithPermitTxHash,
    sendDepositZapWithPermitTransaction,
    isSwapNecessary,
    swapTx,
    isFetchingSwapTx
  } = useSendDepositZapWithPermitTransaction(
    {
      address: inputToken?.address as Address,
      decimals: inputToken?.decimals as number,
      amount: depositAmount
    },
    vault,
    signature as `0x${string}`,
    deadline as bigint,
    nonce as bigint,
    {
      onSend: () => {
        setModalView('waiting')
      },
      onSuccess: (txReceipt) => {
        setIsApproved(false)
        refetchUserInputTokenBalance()
        refetchUserVaultTokenBalance()
        refetchUserVaultDelegationBalance()
        refetchVaultBalance()
        refetchTokenAllowance()
        refetchUserBalances?.()
        onSuccessfulDepositWithPermit?.(vault.chainId, txReceipt)
        setModalView('success')
      },
      onError: () => {
        setModalView('error')
      }
    }
  )

  const {
    isWaiting: isWaitingDepositZap,
    isConfirming: isConfirmingDepositZap,
    isSuccess: isSuccessfulDepositZap,
    txHash: depositZapTxHash,
    sendDepositZapTransaction
  } = useSendDepositZapTransaction(
    {
      address: inputToken?.address as Address,
      decimals: inputToken?.decimals as number,
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
        onSuccessfulDeposit?.(vault.chainId, txReceipt)
        setModalView('success')
      },
      onError: () => {
        setModalView('error')
      }
    }
  )

  useEffect(() => {
    if (isReadyToSendTxAfterSigning && isApproved && !!sendDepositZapWithPermitTransaction) {
      sendDepositZapWithPermitTransaction()
      setIsReadyToSendTxAfterSigning(false)
    }
  }, [isReadyToSendTxAfterSigning, isApproved, sendDepositZapWithPermitTransaction])

  useEffect(() => {
    if (
      !!depositZapWithPermitTxHash &&
      isConfirmingDepositZapWithPermit &&
      !isWaitingDepositZapWithPermit &&
      !isSuccessfulDepositZapWithPermit
    ) {
      setDepositTxHash(depositZapWithPermitTxHash)
      setModalView('confirming')
    } else if (
      !!depositZapTxHash &&
      isConfirmingDepositZap &&
      !isWaitingDepositZap &&
      !isSuccessfulDepositZap
    ) {
      setDepositTxHash(depositZapTxHash)
      setModalView('confirming')
    }
  }, [
    depositZapWithPermitTxHash,
    isConfirmingDepositZapWithPermit,
    depositZapTxHash,
    isConfirmingDepositZap
  ])

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
    (!isSwapNecessary || !!swapTx)

  const depositEnabled =
    isDataFetched && userInputTokenBalance.amount >= depositAmount && isValidFormInputTokenAmount

  // No deposit amount set
  if (depositAmount === 0n) {
    return (
      <Button color='transparent' fullSized={true} disabled={true}>
        {t_modals('enterAnAmount')}
      </Button>
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

  if (isSwapNecessary) {
    // Fetching swap params
    if (isFetchingSwapTx) {
      return (
        <Button fullSized={true} disabled={true}>
          {t_modals('findingZapRoute')}
        </Button>
      )
    }

    // Swap route unavailable
    if (!swapTx) {
      return (
        <Button fullSized={true} disabled={true}>
          {t_modals('noZapRouteFound')}
        </Button>
      )
    }
  }

  // Deposit button
  if (isDataFetched && allowance >= depositAmount) {
    return (
      <TransactionButton
        chainId={vault.chainId}
        isTxLoading={isWaitingDepositZap || isConfirmingDepositZap}
        isTxSuccess={isSuccessfulDepositZap}
        write={sendDepositZapTransaction}
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

  // Sign + deposit zap with permit button
  return (
    <TransactionButton
      chainId={vault.chainId}
      isTxLoading={
        isWaitingApproval || isWaitingDepositZapWithPermit || isConfirmingDepositZapWithPermit
      }
      isTxSuccess={isSuccessfulDepositZapWithPermit}
      write={isApproved ? sendDepositZapWithPermitTransaction : signApprove}
      txHash={depositZapWithPermitTxHash}
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
