import { useGasCostEstimates } from '@generationsoftware/hyperstructure-react-hooks'
import { GasCostEstimates } from '@shared/types'
import { sToMs, twabRewardsABI } from '@shared/utilities'
import { useMemo } from 'react'
import { Address, encodeFunctionData } from 'viem'
import { V4_PROMOTIONS } from '@constants/config'
import { useUserV4ClaimableRewards } from './useUserV4ClaimableRewards'

export const useV4ClaimRewardsGasEstimate = (
  chainId: number,
  userAddress: Address
): { data?: GasCostEstimates; isFetched: boolean } => {
  const { data: claimable, isFetched: isFetchedClaimable } = useUserV4ClaimableRewards(
    chainId,
    userAddress
  )

  const epochsToClaim = useMemo(() => {
    const epochs: { [id: string]: number[] } = {}

    if (isFetchedClaimable && !!claimable) {
      Object.entries(claimable.rewards).forEach(([id, epochRewards]) => {
        epochs[id] = Object.keys(epochRewards).map((k) => parseInt(k))
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
      address: V4_PROMOTIONS[chainId]?.twabRewardsAddress,
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
