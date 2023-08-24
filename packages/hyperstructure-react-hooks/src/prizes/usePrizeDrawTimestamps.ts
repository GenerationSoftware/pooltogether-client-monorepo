import { PrizePool } from '@pooltogether/hyperstructure-client-js'
import { SubgraphDraw } from '@shared/types'
import { getSubgraphDrawTimestamps } from '@shared/utilities'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'

/**
 * Returns prize pool draws and their timestamps
 * @param prizePool instance of the `PrizePool` class
 * @param refetchInterval optional refetch interval in ms
 * @returns
 */
export const usePrizeDrawTimestamps = (
  prizePool: PrizePool,
  refetchInterval?: number
): UseQueryResult<SubgraphDraw[], unknown> => {
  const queryKey = [QUERY_KEYS.drawTimestamps, prizePool?.chainId]

  return useQuery(queryKey, async () => await getSubgraphDrawTimestamps(prizePool?.chainId), {
    enabled: !!prizePool,
    refetchInterval: refetchInterval ?? false
  })
}
