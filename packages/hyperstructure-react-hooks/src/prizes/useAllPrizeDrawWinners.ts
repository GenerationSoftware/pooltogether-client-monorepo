import { PrizePool } from '@pooltogether/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { SubgraphDraw } from '@shared/types'
import { getSubgraphDraws } from '@shared/utilities'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { QUERY_KEYS } from '../constants'

/**
 * Returns all historical draws and winners for any given prize pools
 * @param prizePools instances of `PrizePool`
 * @param options optional settings
 * @returns
 */
export const useAllPrizeDrawWinners = (
  prizePools: PrizePool[],
  options?: {
    first?: number
    skip?: number
    orderDirection?: 'asc' | 'desc'
  }
) => {
  const results = useQueries({
    queries: prizePools.map((prizePool) => {
      return {
        queryKey: [QUERY_KEYS.drawWinners, prizePool?.chainId, JSON.stringify(options)],
        queryFn: async () => {
          const chainId = prizePool.chainId
          const drawWinners = await getSubgraphDraws(chainId, options)
          return drawWinners
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
