import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { prizePoolABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'

export const useEstimatedNextNumTiers = (
  prizePool: PrizePool,
  options?: { refetchInterval?: number }
) => {
  return useQuery({
    queryKey: ['estimatedNextNumTiers', prizePool?.id],
    queryFn: async () => {
      return await prizePool.publicClient.readContract({
        address: prizePool.address,
        abi: prizePoolABI,
        functionName: 'estimateNextNumberOfTiers'
      })
    },
    enabled: !!prizePool,
    ...NO_REFETCH,
    refetchInterval: options?.refetchInterval ?? false
  })
}
