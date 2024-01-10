import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { TransactionButton } from '@shared/react-components'
import { useSendV3PodWithdrawTransaction } from '@hooks/useSendV3PodWithdrawTransaction'
import { V3BalanceToMigrate } from '@hooks/useUserV3Balances'

export interface WithdrawPodButtonProps {
  migration: V3BalanceToMigrate
  txOptions?: Parameters<typeof useSendV3PodWithdrawTransaction>[3]
  className?: string
}

export const WithdrawPodButton = (props: WithdrawPodButtonProps) => {
  const { migration, txOptions, className } = props

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

  const { sendV3PodWithdrawTransaction, isWaiting, isConfirming, isSuccess, txHash } =
    useSendV3PodWithdrawTransaction(
      migration.token.chainId,
      migration.token.address,
      migration.token.amount,
      txOptions
    )

  return (
    <TransactionButton
      chainId={migration.token.chainId}
      isTxLoading={isWaiting || isConfirming}
      isTxSuccess={isSuccess}
      write={sendV3PodWithdrawTransaction}
      txHash={txHash}
      txDescription={`${migration.token.symbol} V3 Pod Withdrawal`}
      openConnectModal={openConnectModal}
      openChainModal={openChainModal}
      addRecentTransaction={addRecentTransaction}
      className={className}
    >
      Withdraw {migration.token.symbol}
    </TransactionButton>
  )
}
