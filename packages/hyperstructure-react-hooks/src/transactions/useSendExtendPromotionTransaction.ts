import { TWAB_REWARDS_ADDRESSES, twabRewardsABI } from '@shared/utilities'
import { useEffect } from 'react'
import { Address, isAddress, TransactionReceipt } from 'viem'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction
} from 'wagmi'
import { useTokenAllowance } from '..'

/**
 * Prepares and submits an `extendPromotion` transaction to a TWAB rewards contract
 * @param chainId the network the promotion to extend is in
 * @param promotionId the ID of the promotion to extend
 * @param tokenAddress the address of the token being distributed
 * @param tokensPerEpoch the number of tokens that are being distributed per epoch
 * @param numberOfEpochs the number of epochs to extend the promotion for (max 255 total)
 * @param options optional settings or callbacks
 * @returns
 */
export const useSendExtendPromotionTransaction = (
  chainId: number,
  promotionId: number,
  tokenAddress: Address,
  tokensPerEpoch: bigint,
  numberOfEpochs: number,
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
  sendExtendPromotionTransaction?: () => void
} => {
  const { address: userAddress } = useAccount()
  const { chain } = useNetwork()

  const twabRewardsAddress = !!chainId ? TWAB_REWARDS_ADDRESSES[chainId] : undefined
  const totalTokens =
    !!tokensPerEpoch && !!numberOfEpochs ? tokensPerEpoch * BigInt(numberOfEpochs) : 0n

  const { data: allowance, isFetched: isFetchedAllowance } = useTokenAllowance(
    chainId,
    userAddress as Address,
    twabRewardsAddress as Address,
    tokenAddress
  )

  const enabled =
    !!chainId &&
    chain?.id === chainId &&
    !!promotionId &&
    !!tokenAddress &&
    isAddress(tokenAddress) &&
    !!twabRewardsAddress &&
    !!totalTokens &&
    isFetchedAllowance &&
    !!allowance &&
    allowance >= totalTokens

  const { config } = usePrepareContractWrite({
    chainId,
    address: twabRewardsAddress,
    abi: twabRewardsABI,
    functionName: 'extendPromotion',
    args: [BigInt(promotionId), numberOfEpochs],
    enabled
  })

  const {
    data: txSendData,
    isLoading: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    write: sendExtendPromotionTransaction
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
    sendExtendPromotionTransaction
  }
}
