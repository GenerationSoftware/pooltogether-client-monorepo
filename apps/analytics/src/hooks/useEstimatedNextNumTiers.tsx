import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { prizePoolABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'

export const useEstimatedNextNumTiers = (
  prizePool: PrizePool,
  options?: { refetchInterval?: number }
) => {
  const publicClient = usePublicClient({ chainId: prizePool?.chainId })

  return useQuery({
    queryKey: ['estimatedNextNumTiers'],
    queryFn: async () => {
      if (!!publicClient) {
        return await publicClient.readContract({
          address: prizePool.address,
          abi: prizePoolABI,
          functionName: 'estimateNextNumberOfTiers'
        })
      }
    },
    enabled: !!publicClient,
    ...NO_REFETCH,
    refetchInterval: options?.refetchInterval ?? false
  })
}
