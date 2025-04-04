import {
  POOL_WIDE_TWAB_REWARDS_ADDRESSES,
  poolWideTwabRewardsABI,
  TWAB_REWARDS_ADDRESSES
} from '@shared/utilities'
import { useMemo } from 'react'
import { Address, encodeFunctionData, Hash, isAddress, WalletCallReceipt } from 'viem'
import { useAccount } from 'wagmi'
import { useSend5792Calls } from './useSend5792Calls'

/**
 * Prepares and submits [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792) calls to claim pool-wide and regular TWAB rewards in one transaction
 * @dev should check if wallet supports this standard before calling this (`useCapabilities` wagmi hook)
 * @param chainId the chain ID these rewards are to be claimed on
 * @param userAddress the user address to claim rewards for
 * @param epochsToClaim epochs to claim from regular promotions
 * @param poolWidePromotionsToClaim data on the pool-wide promotions' epochs to claim
 * @param options optional settings and callbacks
 * @returns
 */
export const useSend5792AggregateClaimRewardsTransaction = (
  chainId: number,
  userAddress: Address,
  epochsToClaim: { [id: string]: number[] },
  poolWidePromotionsToClaim: { id: string; vaultAddress: Address; epochs: number[] }[],
  options?: { twabRewardsAddress?: Address } & Parameters<typeof useSend5792Calls>['2']
) => {
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
    !!POOL_WIDE_TWAB_REWARDS_ADDRESSES[chainId] &&
    options?.enabled !== false

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

  const { sendCalls: send5792AggregateClaimRewardsTransaction, ...rest } = useSend5792Calls(
    chainId,
    [
      {
        to: POOL_WIDE_TWAB_REWARDS_ADDRESSES[chainId],
        data: encodeFunctionData({
          abi: poolWideTwabRewardsABI,
          functionName: 'multicall',
          args: [[...promotionCalldata, ...poolWidePromotionCalldata]]
        })
      }
    ],
    { ...options, enabled }
  )

  return { ...rest, send5792AggregateClaimRewardsTransaction }
}
