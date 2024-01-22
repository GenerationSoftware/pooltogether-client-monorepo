import { useSendRedeemTransaction, useVault } from '@generationsoftware/hyperstructure-react-hooks'
import { ButtonProps } from '@shared/ui'
import { TransactionButton } from '@components/TransactionButton'
import { V5BalanceToMigrate } from '@hooks/useUserV5Balances'

export interface WithdrawButtonProps extends Omit<ButtonProps, 'onClick'> {
  migration: V5BalanceToMigrate
  txOptions?: Parameters<typeof useSendRedeemTransaction>[2]
  hideWrongNetworkState?: boolean
}

export const WithdrawButton = (props: WithdrawButtonProps) => {
  const { migration, txOptions, hideWrongNetworkState, ...rest } = props

  const vault = useVault(migration.vaultInfo)

  const { sendRedeemTransaction, isWaiting, isConfirming, isSuccess, txHash } =
    useSendRedeemTransaction(migration.token.amount, vault, txOptions)

  return (
    <TransactionButton
      chainId={migration.token.chainId}
      isTxLoading={isWaiting || isConfirming}
      isTxSuccess={isSuccess}
      write={sendRedeemTransaction}
      txHash={txHash}
      txDescription={`${migration.token.symbol} V5 Withdrawal`}
      hideWrongNetworkState={hideWrongNetworkState}
      {...rest}
    >
      Withdraw
    </TransactionButton>
  )
}
