import { ButtonProps } from '@shared/ui'
import { TransactionButton } from '@components/TransactionButton'
import { useSendV3PoolWithdrawTransaction } from '@hooks/useSendV3PoolWithdrawTransaction'
import { V3BalanceToMigrate } from '@hooks/useUserV3Balances'

export interface WithdrawPoolButtonProps extends Omit<ButtonProps, 'onClick'> {
  migration: V3BalanceToMigrate
  txOptions?: Parameters<typeof useSendV3PoolWithdrawTransaction>[3]
  includeTokenSymbol?: boolean
  hideWrongNetworkState?: boolean
}

export const WithdrawPoolButton = (props: WithdrawPoolButtonProps) => {
  const { migration, txOptions, includeTokenSymbol, hideWrongNetworkState, ...rest } = props

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
      hideWrongNetworkState={hideWrongNetworkState}
      {...rest}
    >
      Withdraw{includeTokenSymbol ? ` ${migration.token.symbol}` : ''}
    </TransactionButton>
  )
}
