import {
  getPrizePoolHistoricalWins,
  PrizePool,
  SubgraphPrizePoolDraw
} from '@pooltogether/hyperstructure-client-js'
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
): UseQueryResult<SubgraphPrizePoolDraw[], unknown> => {
  const queryKey = [QUERY_KEYS.drawWinners, prizePool?.chainId, JSON.stringify(options)]

  return useQuery(
    queryKey,
    async () => await getPrizePoolHistoricalWins(prizePool?.chainId, options),
    {
      refetchInterval: options?.refetchInterval,
      enabled: !!prizePool
    }
  )
}
