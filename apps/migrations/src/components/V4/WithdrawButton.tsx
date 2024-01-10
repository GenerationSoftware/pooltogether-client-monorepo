import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { TransactionButton } from '@shared/react-components'
import { useSendV4WithdrawTransaction } from '@hooks/useSendV4WithdrawTransaction'
import { V4BalanceToMigrate } from '@hooks/useUserV4Balances'

export interface WithdrawButtonProps {
  migration: V4BalanceToMigrate
  txOptions?: Parameters<typeof useSendV4WithdrawTransaction>['2']
  className?: string
}

export const WithdrawButton = (props: WithdrawButtonProps) => {
  const { migration, txOptions, className } = props

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

  const { sendV4WithdrawTransaction, isWaiting, isConfirming, isSuccess, txHash } =
    useSendV4WithdrawTransaction(migration.token.chainId, migration.token.amount, txOptions)

  return (
    <TransactionButton
      chainId={migration.token.chainId}
      isTxLoading={isWaiting || isConfirming}
      isTxSuccess={isSuccess}
      write={sendV4WithdrawTransaction}
      txHash={txHash}
      txDescription={`${migration.token.symbol} V4 Withdrawal`}
      openConnectModal={openConnectModal}
      openChainModal={openChainModal}
      addRecentTransaction={addRecentTransaction}
      className={className}
    >
      Withdraw {migration.token.symbol}
    </TransactionButton>
  )
}
