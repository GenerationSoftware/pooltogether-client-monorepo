import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { drawManagerABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { formatUnits } from 'viem'
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
        const rewardFraction = await publicClient.readContract({
          address: drawManagerAddress,
          abi: drawManagerABI,
          functionName: 'awardDrawFee'
        })

        return parseFloat(formatUnits(rewardFraction, 18)) * 100
      }
    },
    enabled: !!publicClient,
    ...NO_REFETCH,
    refetchInterval: options?.refetchInterval ?? false
  })
}
