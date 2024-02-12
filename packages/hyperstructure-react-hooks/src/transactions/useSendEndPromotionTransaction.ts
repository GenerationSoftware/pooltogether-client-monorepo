import { TWAB_REWARDS_ADDRESSES, twabRewardsABI } from '@shared/utilities'
import { useEffect } from 'react'
import { Address, isAddress, TransactionReceipt } from 'viem'
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'

/**
 * Prepares and submits an `endPromotion` transaction to a TWAB rewards contract
 * @param chainId the network the promotion to end is in
 * @param promotionId the ID of the promotion to end
 * @param recipient the address to receive any tokens not yet distributed
 * @param options optional settings or callbacks
 * @returns
 */
export const useSendEndPromotionTransaction = (
  chainId: number,
  promotionId: number,
  recipient: Address,
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
  sendEndPromotionTransaction?: () => void
} => {
  const { chain } = useAccount()

  const twabRewardsAddress = !!chainId ? TWAB_REWARDS_ADDRESSES[chainId] : undefined

  const enabled =
    !!chainId &&
    chain?.id === chainId &&
    !!promotionId &&
    !!recipient &&
    isAddress(recipient) &&
    !!twabRewardsAddress

  const { data } = useSimulateContract({
    chainId,
    address: twabRewardsAddress,
    abi: twabRewardsABI,
    functionName: 'endPromotion',
    args: [BigInt(promotionId), recipient],
    query: { enabled }
  })

  const {
    data: txHash,
    isLoading: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    writeContract: _sendEndPromotionTransaction
  } = useWriteContract()

  const sendEndPromotionTransaction =
    !!data && !!_sendEndPromotionTransaction
      ? () => _sendEndPromotionTransaction(data.request)
      : undefined

  useEffect(() => {
    if (!!txHash && isSendingSuccess) {
      options?.onSend?.(txHash)
    }
  }, [isSendingSuccess])

  const {
    data: txReceipt,
    isLoading: isConfirming,
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

  return {
    isWaiting,
    isConfirming,
    isSuccess,
    isError,
    txHash,
    txReceipt,
    sendEndPromotionTransaction
  }
}
