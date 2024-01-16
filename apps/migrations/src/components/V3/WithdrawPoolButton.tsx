import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { TransactionButton } from '@shared/react-components'
import { ButtonProps } from '@shared/ui'
import { useSendV3PoolWithdrawTransaction } from '@hooks/useSendV3PoolWithdrawTransaction'
import { V3BalanceToMigrate } from '@hooks/useUserV3Balances'

export interface WithdrawPoolButtonProps extends Omit<ButtonProps, 'onClick'> {
  migration: V3BalanceToMigrate
  txOptions?: Parameters<typeof useSendV3PoolWithdrawTransaction>[3]
}

export const WithdrawPoolButton = (props: WithdrawPoolButtonProps) => {
  const { migration, txOptions, ...rest } = props

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
      {...rest}
    >
      Withdraw
    </TransactionButton>
  )
}
