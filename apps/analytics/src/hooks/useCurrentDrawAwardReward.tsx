import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { drawManagerABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'

export const useCurrentDrawAwardReward = (
  prizePool: PrizePool,
  options?: { refetchInterval?: number }
) => {
  const publicClient = usePublicClient({ chainId: prizePool?.chainId })

  return useQuery({
    queryKey: ['currentDrawAwardReward'],
    queryFn: async () => {
      if (!!publicClient) {
        const drawManagerAddress = await prizePool.getDrawManagerAddress()

        return await publicClient.readContract({
          address: drawManagerAddress,
          abi: drawManagerABI,
          functionName: 'finishDrawReward'
        })
      }
    },
    enabled: !!publicClient,
    ...NO_REFETCH,
    refetchInterval: options?.refetchInterval ?? false
  })
}
