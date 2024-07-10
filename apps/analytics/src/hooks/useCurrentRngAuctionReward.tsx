import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { drawManagerABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'

export const useCurrentRngAuctionReward = (
  prizePool: PrizePool,
  options?: { refetchInterval?: number }
) => {
  return useQuery({
    queryKey: ['currentRngAuctionReward', prizePool?.id],
    queryFn: async () => {
      const drawManagerAddress = await prizePool.getDrawManagerAddress()

      return await prizePool.publicClient.readContract({
        address: drawManagerAddress,
        abi: drawManagerABI,
        functionName: 'startDrawReward'
      })
    },
    enabled: !!prizePool,
    ...NO_REFETCH,
    refetchInterval: options?.refetchInterval ?? false
  })
}
