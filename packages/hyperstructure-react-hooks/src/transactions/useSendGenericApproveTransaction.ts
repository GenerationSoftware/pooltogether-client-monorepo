import { erc20ABI } from '@shared/utilities'
import { useEffect } from 'react'
import { Address, TransactionReceipt } from 'viem'
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'

/**
 * Prepares and submits a generic ERC20 `approve` transaction
 * @param options optional callbacks
 * @returns
 */
export const useSendGenericApproveTransaction = (
  chainId: number,
  tokenAddress: Address,
  spenderAddress: Address,
  amount: bigint,
  options?: {
    onSend?: (txHash: `0x${string}`) => void
    onSuccess?: (txReceipt: TransactionReceipt) => void
    onError?: () => void
  }
): {
  isWaiting: boolean
  isConfirming: boolean
  isSuccess: boolean
  isError: boolean
  txHash?: Address
  txReceipt?: TransactionReceipt
  sendApproveTransaction?: () => void
} => {
  const { chain } = useAccount()

  const enabled =
    !!chainId && chain?.id === chainId && !!tokenAddress && !!spenderAddress && !!amount

  const { data } = useSimulateContract({
    chainId,
    address: tokenAddress,
    abi: erc20ABI,
    functionName: 'approve',
    args: [spenderAddress, amount],
    query: { enabled }
  })

  const {
    data: txHash,
    isPending: isWaiting,
    isError: isSendingError,
    writeContract: _sendApproveTransaction
  } = useWriteContract()

  const sendApproveTransaction =
    !!data && !!_sendApproveTransaction
      ? () =>
          _sendApproveTransaction(data.request, {
            onSuccess: (txHash) => options?.onSend?.(txHash)
          })
      : undefined

  const {
    data: txReceipt,
    isFetching: isConfirming,
    isSuccess,
    isError: isConfirmingError
  } = useWaitForTransactionReceipt({ chainId, hash: txHash })

  useEffect(() => {
    if (!!txReceipt && isSuccess) {
      options?.onSuccess?.(txReceipt)
    }
  }, [isSuccess])

  const isError = isSendingError || isConfirmingError

  useEffect(() => {
    if (isError) {
      options?.onError?.()
    }
  }, [isError])

  return { isWaiting, isConfirming, isSuccess, isError, txHash, txReceipt, sendApproveTransaction }
}
