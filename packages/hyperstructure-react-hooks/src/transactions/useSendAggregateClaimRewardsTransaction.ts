import {
  POOL_WIDE_TWAB_REWARDS_ADDRESSES,
  poolWideTwabRewardsABI,
  TWAB_REWARDS_ADDRESSES
} from '@shared/utilities'
import { useEffect, useMemo } from 'react'
import { Address, encodeFunctionData, isAddress, TransactionReceipt } from 'viem'
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'

/**
 * Prepares and submits a `multicall` transaction to claim pool-wide and regular TWAB rewards in one transaction
 * @param chainId the chain ID these rewards are to be claimed on
 * @param userAddress the user address to claim rewards for
 * @param epochsToClaim epochs to claim from regular promotions
 * @param poolWidePromotionsToClaim data on the pool-wide promotions' epochs to claim
 * @param options optional settings or callbacks
 * @returns
 */
export const useSendAggregateClaimRewardsTransaction = (
  chainId: number,
  userAddress: Address,
  epochsToClaim: { [id: string]: number[] },
  poolWidePromotionsToClaim: { id: string; vaultAddress: Address; epochs: number[] }[],
  options?: {
    twabRewardsAddress?: Address
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
  sendAggregateClaimRewardsTransaction?: () => void
} => {
  const { chain } = useAccount()

  const twabRewardsAddress = !!chainId
    ? options?.twabRewardsAddress ?? TWAB_REWARDS_ADDRESSES[chainId]
    : undefined

  const enabled =
    !!chainId &&
    chainId === chain?.id &&
    !!userAddress &&
    isAddress(userAddress) &&
    !!epochsToClaim &&
    Object.values(epochsToClaim).some((entry) => !!entry?.length) &&
    !!poolWidePromotionsToClaim &&
    poolWidePromotionsToClaim.some((entry) => !!entry?.vaultAddress && !!entry.epochs?.length) &&
    !!twabRewardsAddress &&
    !!POOL_WIDE_TWAB_REWARDS_ADDRESSES[chainId]

  const promotionCalldata = useMemo(() => {
    const calldata: `0x${string}`[] = []

    if (enabled) {
      Object.entries(epochsToClaim).forEach(([id, epochs]) => {
        if (!!epochs.length) {
          calldata.push(
            encodeFunctionData({
              abi: poolWideTwabRewardsABI,
              functionName: 'claimTwabRewards',
              args: [twabRewardsAddress, userAddress, BigInt(id), epochs]
            })
          )
        }
      })
    }

    return calldata
  }, [userAddress, epochsToClaim, twabRewardsAddress])

  const poolWidePromotionCalldata = useMemo(() => {
    const calldata: `0x${string}`[] = []

    if (enabled) {
      poolWidePromotionsToClaim.forEach((promotion) => {
        if (!!promotion.vaultAddress && !!promotion.epochs?.length) {
          calldata.push(
            encodeFunctionData({
              abi: poolWideTwabRewardsABI,
              functionName: 'claimRewards',
              args: [promotion.vaultAddress, userAddress, BigInt(promotion.id), promotion.epochs]
            })
          )
        }
      })
    }

    return calldata
  }, [userAddress, poolWidePromotionsToClaim])

  const { data: multicallData } = useSimulateContract({
    chainId,
    address: POOL_WIDE_TWAB_REWARDS_ADDRESSES[chainId],
    abi: poolWideTwabRewardsABI,
    functionName: 'multicall',
    args: [[...promotionCalldata, ...poolWidePromotionCalldata]],
    query: { enabled: enabled }
  })

  const {
    data: txHash,
    isPending: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    writeContract: sendMulticallTransaction
  } = useWriteContract()

  const sendAggregateClaimRewardsTransaction =
    !!multicallData && !!sendMulticallTransaction
      ? () => sendMulticallTransaction(multicallData.request)
      : undefined

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

  return {
    isWaiting,
    isConfirming,
    isSuccess,
    isError,
    txHash,
    txReceipt,
    sendAggregateClaimRewardsTransaction
  }
}
