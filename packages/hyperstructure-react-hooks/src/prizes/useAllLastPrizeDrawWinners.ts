import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { SubgraphDraw } from '@shared/types'
import { getPaginatedSubgraphDraws } from '@shared/utilities'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { QUERY_KEYS } from '../constants'

/**
 * Returns all historical draws and the last winners on each, for any given prize pools
 * @param prizePools instances of `PrizePool`
 * @returns
 */
export const useAllLastPrizeDrawWinners = (prizePools: PrizePool[]) => {
  const results = useQueries({
    queries: prizePools.map((prizePool) => {
      return {
        queryKey: [QUERY_KEYS.lastDrawWinners, prizePool?.chainId],
        queryFn: async () =>
          await getPaginatedSubgraphDraws(prizePool.chainId, { onlyLastPrizeClaim: true }),
        staleTime: Infinity,
        enabled: !!prizePool,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)
    const refetch = () => results?.forEach((result) => result.refetch())

    const formattedData: {
      [chainId: number]: SubgraphDraw[]
    } = {}
    results.forEach((result, i) => {
      if (!!result.data) {
        formattedData[prizePools[i].chainId] = result.data
      }
    })

    return { isFetched, refetch, data: formattedData }
  }, [results])
}
