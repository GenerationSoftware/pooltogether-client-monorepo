import { PrizeInfo, PrizePool } from '@pooltogether/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
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
          const prizeInfo = await prizePool.getAllPrizeInfo()
          return { id: prizePool.id, prizeInfo }
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
    results.forEach((result) => {
      if (result.data && result.data.id) {
        formattedData[result.data.id] = result.data.prizeInfo
      }
    })
    return { isFetched, refetch, data: formattedData }
  }, [results])
}
