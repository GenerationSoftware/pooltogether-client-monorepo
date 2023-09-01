import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useSendApproveTransaction,
  useSendDepositTransaction,
  useTokenAllowance,
  useTokenBalance,
  useUserVaultTokenBalance,
  useVaultBalance,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { Intl } from '@shared/types'
import { Button, Spinner } from '@shared/ui'
import { MAX_UINT_256 } from '@shared/utilities'
import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { Address, parseUnits } from 'viem'
import { useAccount, useNetwork } from 'wagmi'
import { DepositModalView } from '.'
import { depositFormTokenAmountAtom } from '../../Form/DepositForm'
import { isValidFormInput } from '../../Form/TxFormInput'
import { ExactApprovalTooltip } from '../../Tooltips/ExactApprovalTooltip'
import { InfiniteApprovalTooltip } from '../../Tooltips/InfiniteApprovalTooltip'
import { TransactionButton } from '../../Transaction/TransactionButton'

interface DepositTxButtonProps {
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
      | 'exactApprovalButton'
      | 'exactApprovalTx'
      | 'infiniteApprovalButton'
      | 'infiniteApprovalTx'
      | 'reviewDeposit'
      | 'confirmDeposit'
      | 'depositTx'
      | 'switchNetwork'
      | 'switchingNetwork'
    >
    common?: Intl<'connectWallet'>
    tooltips?: Intl<'exactApproval' | 'infiniteApproval'>
  }
}

export const DepositTxButton = (props: DepositTxButtonProps) => {
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
    isWaiting: isWaitingExactApproval,
    isConfirming: isConfirmingExactApproval,
    isSuccess: isSuccessfulExactApproval,
    txHash: exactApprovalTxHash,
    sendApproveTransaction: sendExactApproveTransaction
  } = useSendApproveTransaction(depositAmount, vault, {
    onSuccess: () => refetchTokenAllowance()
  })

  const {
    isWaiting: isWaitingInfiniteApproval,
    isConfirming: isConfirmingInfiniteApproval,
    isSuccess: isSuccessfulInfiniteApproval,
    txHash: infiniteApprovalTxHash,
    sendApproveTransaction: sendInfiniteApproveTransaction
  } = useSendApproveTransaction(MAX_UINT_256, vault, {
    onSuccess: () => refetchTokenAllowance()
  })

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
    if (!!depositTxHash && isConfirmingDeposit && !isWaitingDeposit && !isSuccessfulDeposit) {
      setDepositTxHash(depositTxHash)
      setModalView('confirming')
    }
  }, [depositTxHash, isConfirmingDeposit])

  const approvalEnabled =
    !isDisconnected &&
    !!userAddress &&
    !!tokenData &&
    isFetchedUserBalance &&
    !!userBalance &&
    isFetchedAllowance &&
    allowance !== undefined &&
    !!depositAmount &&
    userBalance.amount >= depositAmount &&
    isValidFormTokenAmount &&
    decimals !== undefined

  const depositEnabled =
    !isDisconnected &&
    !!userAddress &&
    !!tokenData &&
    isFetchedUserBalance &&
    !!userBalance &&
    isFetchedAllowance &&
    !!allowance &&
    !!depositAmount &&
    userBalance.amount >= depositAmount &&
    allowance >= depositAmount &&
    isValidFormTokenAmount &&
    decimals !== undefined

  if (depositAmount === 0n) {
    return (
      <Button color='transparent' fullSized={true} disabled={true}>
        {intl?.base?.('enterAnAmount') ?? 'Enter an amount'}
      </Button>
    )
  } else if (
    !isDisconnected &&
    chain?.id === vault.chainId &&
    isFetchedAllowance &&
    allowance !== undefined &&
    allowance < depositAmount
  ) {
    return (
      <div className='flex flex-col w-full gap-4 md:gap-6'>
        <TransactionButton
          chainId={vault.chainId}
          isTxLoading={isWaitingExactApproval || isConfirmingExactApproval}
          isTxSuccess={isSuccessfulExactApproval}
          write={sendExactApproveTransaction}
          txHash={exactApprovalTxHash}
          txDescription={
            intl?.base?.('exactApprovalTx', { symbol: tokenData?.symbol ?? '?' }) ??
            `Exact ${tokenData?.symbol} Approval`
          }
          fullSized={true}
          disabled={!approvalEnabled}
          openConnectModal={openConnectModal}
          openChainModal={openChainModal}
          addRecentTransaction={addRecentTransaction}
          innerClassName='flex gap-2 items-center'
          intl={intl}
        >
          {intl?.base?.('exactApprovalButton', { symbol: tokenData?.symbol ?? '?' }) ??
            `Approve exact amount of ${tokenData?.symbol ?? <Spinner />}`}
          <ExactApprovalTooltip tokenSymbol={tokenData?.symbol ?? '?'} intl={intl?.tooltips} />
        </TransactionButton>
        <TransactionButton
          chainId={vault.chainId}
          isTxLoading={isWaitingInfiniteApproval || isConfirmingInfiniteApproval}
          isTxSuccess={isSuccessfulInfiniteApproval}
          write={sendInfiniteApproveTransaction}
          txHash={infiniteApprovalTxHash}
          txDescription={
            intl?.base?.('infiniteApprovalTx', { symbol: tokenData?.symbol ?? '?' }) ??
            `Infinite ${tokenData?.symbol} Approval`
          }
          fullSized={true}
          disabled={!approvalEnabled}
          openConnectModal={openConnectModal}
          openChainModal={openChainModal}
          addRecentTransaction={addRecentTransaction}
          color='transparent'
          innerClassName='flex gap-2 items-center'
          intl={intl}
        >
          {intl?.base?.('infiniteApprovalButton', { symbol: tokenData?.symbol ?? '?' }) ??
            `Approve unlimited amount of ${tokenData?.symbol ?? <Spinner />}`}
          <InfiniteApprovalTooltip tokenSymbol={tokenData?.symbol ?? '?'} intl={intl?.tooltips} />
        </TransactionButton>
      </div>
    )
  } else if (!isDisconnected && chain?.id === vault.chainId && modalView === 'main') {
    return (
      <Button onClick={() => setModalView('review')} fullSized={true} disabled={!depositEnabled}>
        {intl?.base?.('reviewDeposit') ?? 'Review Deposit'}
      </Button>
    )
  } else {
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
  }
}
