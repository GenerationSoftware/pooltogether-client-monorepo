import { getSecondsSinceEpoch, Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useApproveSignature,
  useSendDepositTransaction,
  useSendDepositWithPermitTransaction,
  useTokenAllowance,
  useTokenBalance,
  useUserVaultTokenBalance,
  useVaultBalance,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { Intl } from '@shared/types'
import { Button } from '@shared/ui'
import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { Address, parseUnits } from 'viem'
import { useAccount, useNetwork } from 'wagmi'
import { DepositModalView } from '.'
import { depositFormTokenAmountAtom } from '../../Form/DepositForm'
import { isValidFormInput } from '../../Form/TxFormInput'
import { TransactionButton } from '../../Transaction/TransactionButton'

interface DepositWithPermitTxButtonProps {
  vault: Vault
  modalView: string
  setModalView: (view: DepositModalView) => void
  setDepositTxHash: (txHash: string) => void
  openConnectModal?: () => void
  openChainModal?: () => void
  addRecentTransaction?: (tx: { hash: string; description: string; confirmations?: number }) => void
  refetchUserBalances?: () => void
  intl?: {
    base?: Intl<
      | 'enterAnAmount'
      | 'reviewDeposit'
      | 'confirmDeposit'
      | 'depositTx'
      | 'switchNetwork'
      | 'switchingNetwork'
    >
    common?: Intl<'connectWallet'>
  }
}

export const DepositWithPermitTxButton = (props: DepositWithPermitTxButtonProps) => {
  const {
    vault,
    modalView,
    setModalView,
    setDepositTxHash,
    openConnectModal,
    openChainModal,
    addRecentTransaction,
    refetchUserBalances,
    intl
  } = props

  const { address: userAddress, isDisconnected } = useAccount()
  const { chain } = useNetwork()

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
    data: userBalance,
    isFetched: isFetchedUserBalance,
    refetch: refetchTokenBalance
  } = useTokenBalance(vault.chainId, userAddress as Address, tokenData?.address as Address)

  const { refetch: refetchVaultBalance } = useVaultBalance(vault)

  const { refetch: refetchUserVaultTokenBalance } = useUserVaultTokenBalance(
    vault,
    userAddress as Address
  )

  const formTokenAmount = useAtomValue(depositFormTokenAmountAtom)

  const isValidFormTokenAmount =
    decimals !== undefined ? isValidFormInput(formTokenAmount, decimals) : false

  const depositAmount = isValidFormTokenAmount
    ? parseUnits(formTokenAmount, decimals as number)
    : 0n

  const {
    signature,
    deadline,
    isWaiting: isWaitingApproval,
    isSuccess: isSuccessfulApproval,
    signApprove
  } = useApproveSignature(depositAmount, vault, { onError: () => setModalView('error') })

  const {
    isWaiting: isWaitingDepositWithPermit,
    isConfirming: isConfirmingDepositWithPermit,
    isSuccess: isSuccessfulDepositWithPermit,
    txHash: depositWithPermitTxHash,
    sendDepositWithPermitTransaction
  } = useSendDepositWithPermitTransaction(
    depositAmount,
    vault,
    signature as `0x${string}`,
    deadline as bigint,
    {
      onSend: () => {
        setModalView('waiting')
      },
      onSuccess: () => {
        refetchTokenBalance()
        refetchVaultBalance()
        refetchUserVaultTokenBalance()
        refetchUserBalances?.()
        refetchTokenAllowance()
        setModalView('success')
      },
      onError: () => {
        setModalView('error')
      }
    }
  )

  const {
    isWaiting: isWaitingDeposit,
    isConfirming: isConfirmingDeposit,
    isSuccess: isSuccessfulDeposit,
    txHash: depositTxHash,
    sendDepositTransaction
  } = useSendDepositTransaction(depositAmount, vault, {
    onSend: () => {
      setModalView('waiting')
    },
    onSuccess: () => {
      refetchTokenBalance()
      refetchVaultBalance()
      refetchUserVaultTokenBalance()
      refetchUserBalances?.()
      refetchTokenAllowance()
      setModalView('success')
    },
    onError: () => {
      setModalView('error')
    }
  })

  useEffect(() => {
    if (
      !!signature &&
      !!deadline &&
      Number(deadline) > getSecondsSinceEpoch() &&
      isSuccessfulApproval &&
      !!sendDepositWithPermitTransaction
    ) {
      sendDepositWithPermitTransaction()
    }
  }, [signature, deadline, isSuccessfulApproval, sendDepositWithPermitTransaction])

  useEffect(() => {
    if (
      !!depositWithPermitTxHash &&
      isConfirmingDepositWithPermit &&
      !isWaitingDepositWithPermit &&
      !isSuccessfulDepositWithPermit
    ) {
      setDepositTxHash(depositWithPermitTxHash)
      setModalView('confirming')
    } else if (
      !!depositTxHash &&
      isConfirmingDeposit &&
      !isWaitingDeposit &&
      !isSuccessfulDeposit
    ) {
      setDepositTxHash(depositTxHash)
      setModalView('confirming')
    }
  }, [depositWithPermitTxHash, isConfirmingDepositWithPermit, depositTxHash, isConfirmingDeposit])

  const isDataFetched =
    !isDisconnected &&
    !!userAddress &&
    !!tokenData &&
    isFetchedUserBalance &&
    !!userBalance &&
    isFetchedAllowance &&
    allowance !== undefined &&
    !!depositAmount &&
    decimals !== undefined &&
    chain?.id === vault.chainId

  const isApproved =
    isDataFetched &&
    (allowance >= depositAmount ||
      (!!signature && !!deadline && Number(deadline) > getSecondsSinceEpoch()))

  const depositEnabled =
    isDataFetched && userBalance.amount >= depositAmount && isValidFormTokenAmount && isApproved

  const depositWithPermitEnabled =
    isDataFetched && userBalance.amount >= depositAmount && isValidFormTokenAmount

  if (depositAmount === 0n) {
    return (
      <Button color='transparent' fullSized={true} disabled={true}>
        {intl?.base?.('enterAnAmount') ?? 'Enter an amount'}
      </Button>
    )
  } else if (isDataFetched && modalView === 'main') {
    return (
      <Button
        onClick={() => setModalView('review')}
        fullSized={true}
        disabled={!depositWithPermitEnabled}
      >
        {intl?.base?.('reviewDeposit') ?? 'Review Deposit'}
      </Button>
    )
  } else if (isDataFetched && allowance >= depositAmount) {
    return (
      <TransactionButton
        chainId={vault.chainId}
        isTxLoading={isWaitingDeposit || isConfirmingDeposit}
        isTxSuccess={isSuccessfulDeposit}
        write={sendDepositTransaction}
        txHash={depositTxHash}
        txDescription={
          intl?.base?.('depositTx', { symbol: tokenData?.symbol ?? '?' }) ??
          `${tokenData?.symbol} Deposit`
        }
        fullSized={true}
        disabled={!depositEnabled}
        openConnectModal={openConnectModal}
        openChainModal={openChainModal}
        addRecentTransaction={addRecentTransaction}
        intl={intl}
      >
        {intl?.base?.('confirmDeposit') ?? 'Confirm Deposit'}
      </TransactionButton>
    )
  } else {
    return (
      <TransactionButton
        chainId={vault.chainId}
        isTxLoading={
          isWaitingApproval || isWaitingDepositWithPermit || isConfirmingDepositWithPermit
        }
        isTxSuccess={isSuccessfulDepositWithPermit}
        write={isApproved ? sendDepositWithPermitTransaction : signApprove}
        txHash={depositWithPermitTxHash}
        txDescription={
          intl?.base?.('depositTx', { symbol: tokenData?.symbol ?? '?' }) ??
          `${tokenData?.symbol} Deposit`
        }
        fullSized={true}
        disabled={!depositWithPermitEnabled}
        openConnectModal={openConnectModal}
        openChainModal={openChainModal}
        addRecentTransaction={addRecentTransaction}
        intl={intl}
      >
        {intl?.base?.('confirmDeposit') ?? 'Confirm Deposit'}
      </TransactionButton>
    )
  }
}
