import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { drawManagerABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'

export const useCurrentDrawAwardReward = (
  prizePool: PrizePool,
  options?: { refetchInterval?: number }
) => {
  return useQuery({
    queryKey: ['currentDrawAwardReward', prizePool?.id],
    queryFn: async () => {
      const drawManagerAddress = await prizePool.getDrawManagerAddress()

      return await prizePool.publicClient.readContract({
        address: drawManagerAddress,
        abi: drawManagerABI,
        functionName: 'finishDrawReward'
      })
    },
    enabled: !!prizePool,
    ...NO_REFETCH,
    refetchInterval: options?.refetchInterval ?? false
  })
}
