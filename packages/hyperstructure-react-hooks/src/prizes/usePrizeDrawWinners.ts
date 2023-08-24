import { PrizePool } from '@pooltogether/hyperstructure-client-js'
import { SubgraphDraw } from '@shared/types'
import { getSubgraphDraws } from '@shared/utilities'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'

/**
 * Returns historical prize pool draws and their winners
 * @param prizePool instance of the `PrizePool` class
 * @param options optional settings
 * @returns
 */
export const usePrizeDrawWinners = (
  prizePool: PrizePool,
  options?: {
    first?: number
    skip?: number
    orderDirection?: 'asc' | 'desc'
    refetchInterval?: number
  }
): UseQueryResult<SubgraphDraw[], unknown> => {
  const queryKey = [QUERY_KEYS.drawWinners, prizePool?.chainId, JSON.stringify(options)]

  return useQuery(queryKey, async () => await getSubgraphDraws(prizePool?.chainId, options), {
    refetchInterval: options?.refetchInterval ?? false,
    enabled: !!prizePool
  })
}
