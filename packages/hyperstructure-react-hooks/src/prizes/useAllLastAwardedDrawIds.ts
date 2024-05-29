import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { QUERY_KEYS } from '../constants'

/**
 * Returns all prize pools' last awarded draw ID
 * @param prizePools instances of the `PrizePool` class
 * @returns
 */
export const useAllLastAwardedDrawIds = (prizePools: PrizePool[]) => {
  const results = useQueries({
    queries: prizePools.map((prizePool) => {
      return {
        queryKey: [QUERY_KEYS.lastAwardedDrawId, prizePool?.id],
        queryFn: async () => await prizePool.getLastAwardedDrawId(),
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
