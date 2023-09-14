import { NO_REFETCH } from '@shared/generic-react-hooks'
import { NETWORK, RNG_AUCTION_ADDRESS, rngAuctionABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { formatUnits } from 'viem'
import { usePublicClient } from 'wagmi'

export const useDrawRngFeePercentage = (options?: { refetchInterval?: number }) => {
  const publicClient = usePublicClient({ chainId: NETWORK.mainnet })

  return useQuery(
    ['drawRngFeePercentage'],
    async () => {
      const isAuctionOpen = await publicClient.readContract({
        address: RNG_AUCTION_ADDRESS,
        abi: rngAuctionABI,
        functionName: 'isAuctionOpen'
      })

      if (isAuctionOpen) {
        const elapsedTime = await publicClient.readContract({
          address: RNG_AUCTION_ADDRESS,
          abi: rngAuctionABI,
          functionName: 'auctionElapsedTime'
        })

        const rewardFraction = await publicClient.readContract({
          address: RNG_AUCTION_ADDRESS,
          abi: rngAuctionABI,
          functionName: 'computeRewardFraction',
          args: [elapsedTime]
        })

        return parseFloat(formatUnits(rewardFraction, 18)) * 100
      }

      return 0
    },
    {
      enabled: !!publicClient,
      ...NO_REFETCH,
      refetchInterval: options?.refetchInterval ?? false
    }
  )
}
