import { erc20ABI, TWAB_REWARDS_ADDRESSES } from '@shared/utilities'
import { useEffect } from 'react'
import { Address, TransactionReceipt } from 'viem'
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'

/**
 * Prepares and submits an `approve` transaction for a token to the TWAB rewards contract
 * @param options optional callbacks
 * @returns
 */
export const useSendApproveTransaction = (
  chainId: number,
  tokenAddress: Address,
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

  const twabRewardsAddress = !!chainId ? TWAB_REWARDS_ADDRESSES[chainId] : undefined

  const enabled =
    !!chainId && chain?.id === chainId && !!tokenAddress && !!amount && !!twabRewardsAddress

  const { data } = useSimulateContract({
    chainId,
    address: tokenAddress,
    abi: erc20ABI,
    functionName: 'approve',
    args: [twabRewardsAddress as Address, amount],
    query: { enabled }
  })

  const {
    data: txHash,
    isPending: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    writeContract: _sendApproveTransaction
  } = useWriteContract()

  const sendApproveTransaction =
    !!data && !!_sendApproveTransaction ? () => _sendApproveTransaction(data.request) : undefined

  useEffect(() => {
    if (!!txHash && isSendingSuccess) {
      options?.onSend?.(txHash)
    }
  }, [isSendingSuccess])

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
