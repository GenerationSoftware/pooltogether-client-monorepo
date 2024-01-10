import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { TransactionButton } from '@shared/react-components'
import { useSendV3PoolWithdrawTransaction } from '@hooks/useSendV3PoolWithdrawTransaction'
import { V3BalanceToMigrate } from '@hooks/useUserV3Balances'

export interface WithdrawPoolButtonProps {
  migration: V3BalanceToMigrate
  txOptions?: Parameters<typeof useSendV3PoolWithdrawTransaction>[3]
  className?: string
}

export const WithdrawPoolButton = (props: WithdrawPoolButtonProps) => {
  const { migration, txOptions, className } = props

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

  const { sendV3PoolWithdrawTransaction, isWaiting, isConfirming, isSuccess, txHash } =
    useSendV3PoolWithdrawTransaction(
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
      write={sendV3PoolWithdrawTransaction}
      txHash={txHash}
      txDescription={`${migration.token.symbol} V3 Pool Withdrawal`}
      openConnectModal={openConnectModal}
      openChainModal={openChainModal}
      addRecentTransaction={addRecentTransaction}
      className={className}
    >
      Withdraw {migration.token.symbol}
    </TransactionButton>
  )
}
