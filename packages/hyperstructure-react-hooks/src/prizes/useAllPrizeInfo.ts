import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { PrizeInfo } from '@shared/types'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { QUERY_KEYS } from '../constants'

/**
 * Returns prize info for all given prize pools
 * @param prizePools instances of `PrizePool` to query prize info for
 * @returns
 */
export const useAllPrizeInfo = (prizePools: PrizePool[]) => {
  const results = useQueries({
    queries: prizePools.map((prizePool) => {
      const queryKey = [QUERY_KEYS.prizeInfo, prizePool?.id]

      return {
        queryKey: queryKey,
        queryFn: async () => {
          const prizeInfo = await prizePool.getAllPrizeInfo({ considerPastDraws: 7 })
          return prizeInfo
        },
        enabled: !!prizePool,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)
    const refetch = () => results?.forEach((result) => result.refetch())

    const formattedData: { [prizePoolId: string]: PrizeInfo[] } = {}
    results.forEach((result, i) => {
      if (!!result.data) {
        formattedData[prizePools[i].id] = result.data
      }
    })
    return { isFetched, refetch, data: formattedData }
  }, [results])
}
