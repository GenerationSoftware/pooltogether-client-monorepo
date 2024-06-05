import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { TokenWithSupply } from '@shared/types'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { QUERY_KEYS } from '../constants'

// TODO: cache individual results
/**
 * Returns basic data about the tokens awarded by any given prize pools
 * @param prizePools instances of the `PrizePool` class
 * @returns
 */
export const useAllPrizeTokenData = (prizePools: PrizePool[]) => {
  const results = useQueries({
    queries: prizePools.map((prizePool) => {
      const queryKey = [QUERY_KEYS.prizeTokenData, prizePool?.id]

      return {
        queryKey: queryKey,
        queryFn: async () => await prizePool.getPrizeTokenData(),
        enabled: !!prizePool,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)
    const refetch = () => results?.forEach((result) => result.refetch())

    const formattedData: { [prizePoolId: string]: TokenWithSupply } = {}
    results.forEach((result, i) => {
      if (!!result.data) {
        formattedData[prizePools[i].id] = result.data
      }
    })
    return { isFetched, refetch, data: formattedData }
  }, [results])
}
