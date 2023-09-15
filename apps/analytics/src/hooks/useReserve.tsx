import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { prizePoolABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'

export const useReserve = (prizePool: PrizePool) => {
  const publicClient = usePublicClient({ chainId: prizePool.chainId })

  const queryKey = ['reserve', prizePool?.chainId]

  return useQuery(
    queryKey,
    async () => {
      return await publicClient.readContract({
        address: prizePool.address,
        abi: prizePoolABI,
        functionName: 'reserve'
      })
    },
    {
      enabled: !!prizePool && !!publicClient,
      ...NO_REFETCH
    }
  )
}
