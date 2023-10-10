import { NO_REFETCH } from '@shared/generic-react-hooks'
import { NETWORK, RNG_AUCTION, rngAuctionABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { formatUnits } from 'viem'
import { usePublicClient } from 'wagmi'

export const useDrawRngFeePercentage = (options?: { refetchInterval?: number }) => {
  const publicClient = usePublicClient({ chainId: NETWORK.mainnet })

  return useQuery(
    ['drawRngFeePercentage'],
    async () => {
      const isAuctionOpen = await publicClient.readContract({
        address: RNG_AUCTION[NETWORK.mainnet].address,
        abi: rngAuctionABI,
        functionName: 'isAuctionOpen'
      })

      if (isAuctionOpen) {
        const rewardFraction = await publicClient.readContract({
          address: RNG_AUCTION[NETWORK.mainnet].address,
          abi: rngAuctionABI,
          functionName: 'currentFractionalReward'
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
