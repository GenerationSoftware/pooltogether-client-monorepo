import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getSimpleMulticallResults, prizePoolABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'

export const useReserve = (prizePool: PrizePool, options?: { refetchInterval?: number }) => {
  const publicClient = usePublicClient({ chainId: prizePool?.chainId })

  const queryKey = ['reserve', prizePool?.chainId]

  return useQuery(
    queryKey,
    async () => {
      const multicallResults = await getSimpleMulticallResults(
        publicClient,
        prizePool.address,
        prizePoolABI,
        [{ functionName: 'reserve' }, { functionName: 'reserveForOpenDraw' }]
      )

      const reserve = typeof multicallResults[0] === 'bigint' ? multicallResults[0] : 0n
      const reserveForOpenDraw = typeof multicallResults[1] === 'bigint' ? multicallResults[1] : 0n

      return reserve + reserveForOpenDraw
    },
    {
      enabled: !!prizePool && !!publicClient,
      ...NO_REFETCH,
      refetchInterval: options?.refetchInterval ?? false
    }
  )
}
