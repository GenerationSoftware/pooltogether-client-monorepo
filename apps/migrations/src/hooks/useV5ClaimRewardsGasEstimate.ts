import { useGasCostEstimates } from '@generationsoftware/hyperstructure-react-hooks'
import { GasCostEstimates } from '@shared/types'
import { sToMs, TWAB_REWARDS_ADDRESSES, twabRewardsABI } from '@shared/utilities'
import { useMemo } from 'react'
import { Address, encodeFunctionData } from 'viem'
import { useUserV5ClaimableRewards } from './useUserV5ClaimableRewards'

export const useV5ClaimRewardsGasEstimate = (
  chainId: number,
  vaultAddress: Address,
  userAddress: Address,
  options?: { twabRewardsAddress?: Address }
): { data?: GasCostEstimates; isFetched: boolean } => {
  const twabRewardsAddress = options?.twabRewardsAddress ?? TWAB_REWARDS_ADDRESSES[chainId]

  const { data: claimable, isFetched: isFetchedClaimable } = useUserV5ClaimableRewards(
    chainId,
    vaultAddress,
    userAddress
  )

  const epochsToClaim = useMemo(() => {
    const epochs: { [id: string]: number[] } = {}

    if (isFetchedClaimable && claimable.length > 0) {
      claimable.forEach((promotion) => {
        if (promotion.twabRewardsAddress === twabRewardsAddress.toLowerCase()) {
          const epochIds = Object.keys(promotion.rewards).map((k) => parseInt(k))

          if (!!epochIds.length) {
            epochs[promotion.promotionId.toString()] = epochIds
          }
        }
      })
    }

    return epochs
  }, [claimable, isFetchedClaimable])

  const claimRewardsArgs = useMemo((): [Address, bigint, number[]] | undefined => {
    const promotion = Object.entries(epochsToClaim).find((entry) => !!entry[1].length)

    if (!!promotion) {
      return [userAddress, BigInt(promotion[0]), promotion[1]]
    }
  }, [userAddress, epochsToClaim])

  const isMulticall = useMemo(() => {
    const numValidPromotions = Object.values(epochsToClaim).filter(
      (epochs) => !!epochs.length
    ).length
    return numValidPromotions > 1
  }, [epochsToClaim])

  const multicallArgs = useMemo((): [`0x${string}`[]] | undefined => {
    if (isMulticall) {
      const validPromotions = Object.entries(epochsToClaim).filter((entry) => !!entry[1].length)

      const args = validPromotions.map((promotion) => {
        const callData = encodeFunctionData({
          abi: twabRewardsABI,
          args: [userAddress, BigInt(promotion[0]), promotion[1]],
          functionName: 'claimRewards'
        })
        return callData
      })

      return [args]
    }
  }, [userAddress, epochsToClaim, isMulticall])

  const { data: gasEstimates, isFetched: isFetchedGasEstimates } = useGasCostEstimates(
    chainId,
    {
      address: twabRewardsAddress,
      abi: twabRewardsABI,
      functionName: isMulticall ? 'multicall' : 'claimRewards',
      args: isMulticall ? multicallArgs : claimRewardsArgs,
      account: userAddress
    },
    { refetchInterval: sToMs(10) }
  )

  const isFetched = isFetchedClaimable && isFetchedGasEstimates

  return { data: gasEstimates, isFetched }
}
