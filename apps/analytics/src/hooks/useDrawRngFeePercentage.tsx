import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { RNG_AUCTION, rngAuctionABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { formatUnits } from 'viem'
import { usePublicClient } from 'wagmi'
import { RELAY_ORIGINS } from '@constants/config'

export const useDrawRngFeePercentage = (
  prizePool: PrizePool,
  options?: { refetchInterval?: number }
) => {
  const originChainId = !!prizePool ? RELAY_ORIGINS[prizePool.chainId] : undefined
  const publicClient = usePublicClient({ chainId: originChainId })

  return useQuery(
    ['drawRngFeePercentage'],
    async () => {
      const isAuctionOpen = await publicClient.readContract({
        address: RNG_AUCTION[originChainId as number].address,
        abi: rngAuctionABI,
        functionName: 'isAuctionOpen'
      })

      if (isAuctionOpen) {
        const rewardFraction = await publicClient.readContract({
          address: RNG_AUCTION[originChainId as number].address,
          abi: rngAuctionABI,
          functionName: 'currentFractionalReward'
        })

        return parseFloat(formatUnits(rewardFraction, 18)) * 100
      }

      return 0
    },
    {
      enabled: !!originChainId && !!publicClient,
      ...NO_REFETCH,
      refetchInterval: options?.refetchInterval ?? false
    }
  )
}
