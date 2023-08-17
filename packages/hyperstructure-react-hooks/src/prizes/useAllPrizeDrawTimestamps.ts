import { getPrizePoolDrawTimestamps, PrizePool } from '@pooltogether/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { QUERY_KEYS } from '../constants'

/**
 * Returns all draw timestamps for any given prize pools
 * @param prizePools instances of `PrizePool`
 * @returns
 */
export const useAllPrizeDrawTimestamps = (prizePools: PrizePool[]) => {
  const results = useQueries({
    queries: prizePools.map((prizePool) => {
      return {
        queryKey: [QUERY_KEYS.drawTimestamps, prizePool?.chainId],
        queryFn: async () => {
          const chainId = prizePool.chainId
          const drawTimestamps = await getPrizePoolDrawTimestamps(chainId)
          return { chainId, drawTimestamps }
        },
        staleTime: Infinity,
        enabled: !!prizePool,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)
    const refetch = () => results?.forEach((result) => result.refetch())

    const formattedData: { [chainId: number]: { id: number; timestamp: number }[] } = {}
    results.forEach((result) => {
      if (result.data) {
        formattedData[result.data.chainId] = result.data.drawTimestamps
      }
    })

    return { isFetched, refetch, data: formattedData }
  }, [results])
}
