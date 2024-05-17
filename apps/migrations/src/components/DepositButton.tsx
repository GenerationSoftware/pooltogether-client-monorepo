import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useSendApproveTransaction,
  useSendDepositTransaction,
  useTokenAllowance,
  useTokenBalance
} from '@generationsoftware/hyperstructure-react-hooks'
import { TokenWithAmount } from '@shared/types'
import { ButtonProps } from '@shared/ui'
import { Address } from 'viem'
import { TransactionButton } from '@components/TransactionButton'

interface DepositButtonProps extends Omit<ButtonProps, 'onClick'> {
  userAddress: Address
  vault: Vault
  token: TokenWithAmount
  txOptions?: Parameters<typeof useSendDepositTransaction>[2]
}

export const DepositButton = (props: DepositButtonProps) => {
  const { userAddress, vault, token, txOptions, ...rest } = props

  const {
    data: allowance,
    isFetched: isFetchedAllowance,
    refetch: refetchAllowance
  } = useTokenAllowance(vault.chainId, userAddress, vault.address, token.address)

  const { data: balance, isFetched: isFetchedBalance } = useTokenBalance(
    token.chainId,
    userAddress,
    token.address
  )

  const {
    isWaiting: isWaitingApproval,
    isConfirming: isConfirmingApproval,
    isSuccess: isSuccessfulApproval,
    txHash: approvalTxHash,
    sendApproveTransaction: sendApproveTransaction
  } = useSendApproveTransaction(token.amount, vault, {
    onSuccess: () => {
      refetchAllowance()
    }
  })

  const {
    isWaiting: isWaitingDeposit,
    isConfirming: isConfirmingDeposit,
    isSuccess: isSuccessfulDeposit,
    txHash: depositTxHash,
    sendDepositTransaction
  } = useSendDepositTransaction(token.amount, vault, {
    ...txOptions,
    onSuccess: (txReceipt) => {
      refetchAllowance()
      txOptions?.onSuccess?.(txReceipt)
    }
  })

  const isDataFetched =
    !!userAddress &&
    !!vault &&
    !!token &&
    allowance !== undefined &&
    isFetchedAllowance &&
    balance !== undefined &&
    isFetchedBalance

  const approvalEnabled =
    isDataFetched && !!token.amount && !!balance.amount && balance.amount >= token.amount

  const depositEnabled =
    isDataFetched &&
    !!token.amount &&
    !!balance.amount &&
    balance.amount >= token.amount &&
    allowance >= token.amount

  if (isDataFetched && allowance < token.amount) {
    return (
      <TransactionButton
        chainId={vault.chainId}
        isTxLoading={isWaitingApproval || isConfirmingApproval}
        isTxSuccess={isSuccessfulApproval}
        write={sendApproveTransaction}
        txHash={approvalTxHash}
        txDescription={`${token.symbol} Approval`}
        disabled={!approvalEnabled}
        {...rest}
      >
        Approve {token.symbol}
      </TransactionButton>
    )
  }

  return (
    <TransactionButton
      chainId={vault.chainId}
      isTxLoading={isWaitingDeposit || isConfirmingDeposit}
      isTxSuccess={isSuccessfulDeposit}
      write={sendDepositTransaction}
      txHash={depositTxHash}
      txDescription={`${token.symbol} Deposit`}
      disabled={!depositEnabled}
      {...rest}
    >
      Deposit {token.symbol}
    </TransactionButton>
  )
}
