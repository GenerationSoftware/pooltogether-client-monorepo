import { TWAB_REWARDS_ADDRESSES, twabRewardsABI } from '@shared/utilities'
import { useEffect } from 'react'
import { Address, isAddress, TransactionReceipt } from 'viem'
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

/**
 * Prepares and submits a `destroyPromotion` transaction to a TWAB rewards contract
 * @param chainId the network the promotion to destroy is in
 * @param promotionId the ID of the promotion to destroy
 * @param recipient the address to receive any unclaimed tokens
 * @param options optional settings or callbacks
 * @returns
 */
export const useSendDestroyPromotionTransaction = (
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
  sendDestroyPromotionTransaction?: () => void
} => {
  const { chain } = useNetwork()

  const twabRewardsAddress = !!chainId ? TWAB_REWARDS_ADDRESSES[chainId] : undefined

  const enabled =
    !!chainId &&
    chain?.id === chainId &&
    !!promotionId &&
    !!recipient &&
    isAddress(recipient) &&
    !!twabRewardsAddress

  const { config } = usePrepareContractWrite({
    chainId,
    address: twabRewardsAddress,
    abi: twabRewardsABI,
    functionName: 'destroyPromotion',
    args: [BigInt(promotionId), recipient],
    enabled
  })

  const {
    data: txSendData,
    isLoading: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    write: sendDestroyPromotionTransaction
  } = useContractWrite(config)

  const txHash = txSendData?.hash

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
  } = useWaitForTransaction({ chainId, hash: txHash })

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
    sendDestroyPromotionTransaction
  }
}
