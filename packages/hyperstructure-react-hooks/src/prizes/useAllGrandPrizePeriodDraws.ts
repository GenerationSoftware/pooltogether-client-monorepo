import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { QUERY_KEYS } from '../constants'

/**
 * Returns all prize pools' number of draws targeted to distribute the grand prize
 * @param prizePools instances of the `PrizePool` class
 * @returns
 */
export const useAllGrandPrizePeriodDraws = (prizePools: PrizePool[]) => {
  const results = useQueries({
    queries: prizePools.map((prizePool) => {
      return {
        queryKey: [QUERY_KEYS.grandPrizePeriodDraws, prizePool?.id],
        queryFn: async () => await prizePool.getGrandPrizePeriodDraws(),
        enabled: !!prizePool,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)

    const data: { [prizePoolId: string]: number } = {}
    results.forEach((result, i) => {
      if (!!result.data) {
        data[prizePools[i].id] = result.data
      }
    })

    return { isFetched, data }
  }, [results])
}
