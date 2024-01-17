import { ButtonProps } from '@shared/ui'
import { TransactionButton } from '@components/TransactionButton'
import { useSendV4WithdrawTransaction } from '@hooks/useSendV4WithdrawTransaction'
import { V4BalanceToMigrate } from '@hooks/useUserV4Balances'

export interface WithdrawButtonProps extends Omit<ButtonProps, 'onClick'> {
  migration: V4BalanceToMigrate
  txOptions?: Parameters<typeof useSendV4WithdrawTransaction>[2]
}

export const WithdrawButton = (props: WithdrawButtonProps) => {
  const { migration, txOptions, ...rest } = props

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
      {...rest}
    >
      Withdraw
    </TransactionButton>
  )
}
