import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useApproveSignature,
  useSendDepositTransaction,
  useSendDepositWithPermitTransaction,
  useTokenAllowance
} from '@generationsoftware/hyperstructure-react-hooks'
import { TokenWithAmount } from '@shared/types'
import { ButtonProps } from '@shared/ui'
import { useEffect, useState } from 'react'
import { Address } from 'viem'
import { TransactionButton } from '@components/TransactionButton'

interface DepositWithPermitButtonProps extends Omit<ButtonProps, 'onClick'> {
  userAddress: Address
  vault: Vault
  token: TokenWithAmount
  txOptions?: Parameters<typeof useSendDepositWithPermitTransaction>[4]
}

export const DepositWithPermitButton = (props: DepositWithPermitButtonProps) => {
  const { userAddress, vault, token, txOptions, ...rest } = props

  const {
    data: allowance,
    isFetched: isFetchedAllowance,
    refetch: refetchAllowance
  } = useTokenAllowance(vault.chainId, userAddress, vault.address, token.address)

  const [isApproved, setIsApproved] = useState<boolean>(false)
  const [isReadyToSendTxAfterSigning, setIsReadyToSendTxAfterSigning] = useState<boolean>(false)

  const {
    signature,
    deadline,
    isWaiting: isWaitingApproval,
    signApprove
  } = useApproveSignature(token.amount, vault, {
    onSuccess: () => {
      setIsApproved(true)
      setIsReadyToSendTxAfterSigning(true)
    }
  })

  const {
    isWaiting: isWaitingDepositWithPermit,
    isConfirming: isConfirmingDepositWithPermit,
    isSuccess: isSuccessfulDepositWithPermit,
    txHash: depositWithPermitTxHash,
    sendDepositWithPermitTransaction
  } = useSendDepositWithPermitTransaction(
    token.amount,
    vault,
    signature as `0x${string}`,
    deadline as bigint,
    {
      ...txOptions,
      onSuccess: (txReceipt) => {
        setIsApproved(false)
        txOptions?.onSuccess?.(txReceipt)
      }
    }
  )

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

  useEffect(() => {
    if (isReadyToSendTxAfterSigning && isApproved && !!sendDepositWithPermitTransaction) {
      sendDepositWithPermitTransaction()
      setIsReadyToSendTxAfterSigning(false)
    }
  }, [isReadyToSendTxAfterSigning, isApproved, sendDepositWithPermitTransaction])

  if (isFetchedAllowance && allowance !== undefined && allowance >= token.amount) {
    return (
      <TransactionButton
        chainId={vault.chainId}
        isTxLoading={isWaitingDeposit || isConfirmingDeposit}
        isTxSuccess={isSuccessfulDeposit}
        write={sendDepositTransaction}
        txHash={depositTxHash}
        txDescription={`${token.symbol} Deposit`}
        {...rest}
      >
        Deposit {token.symbol}
      </TransactionButton>
    )
  } else {
    return (
      <TransactionButton
        chainId={vault.chainId}
        isTxLoading={
          isWaitingApproval || isWaitingDepositWithPermit || isConfirmingDepositWithPermit
        }
        isTxSuccess={isSuccessfulDepositWithPermit}
        write={isApproved ? sendDepositWithPermitTransaction : signApprove}
        txHash={depositWithPermitTxHash}
        txDescription={`${token.symbol} Deposit`}
        {...rest}
      >
        Deposit {token.symbol}
      </TransactionButton>
    )
  }
}
