import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { SubgraphDraw } from '@shared/types'
import { getPaginatedSubgraphDraws } from '@shared/utilities'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { QUERY_KEYS } from '../constants'

/**
 * Returns all historical draws and winners for any given prize pools
 * @param prizePools instances of `PrizePool`
 * @returns
 */
export const useAllPrizeDrawWinners = (prizePools: PrizePool[]) => {
  const results = useQueries({
    queries: prizePools.map((prizePool) => {
      return {
        queryKey: [QUERY_KEYS.drawWinners, prizePool?.chainId],
        queryFn: async () => {
          const chainId = prizePool.chainId
          const drawWinners = await getPaginatedSubgraphDraws(chainId)
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
