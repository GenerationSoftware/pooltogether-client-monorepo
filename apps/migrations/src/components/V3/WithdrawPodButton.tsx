import { ButtonProps } from '@shared/ui'
import { TransactionButton } from '@components/TransactionButton'
import { useSendV3PodWithdrawTransaction } from '@hooks/useSendV3PodWithdrawTransaction'
import { V3BalanceToMigrate } from '@hooks/useUserV3Balances'

export interface WithdrawPodButtonProps extends Omit<ButtonProps, 'onClick'> {
  migration: V3BalanceToMigrate
  txOptions?: Parameters<typeof useSendV3PodWithdrawTransaction>[3]
}

export const WithdrawPodButton = (props: WithdrawPodButtonProps) => {
  const { migration, txOptions, ...rest } = props

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
      {...rest}
    >
      Withdraw
    </TransactionButton>
  )
}
