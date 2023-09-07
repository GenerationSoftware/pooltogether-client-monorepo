import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a prize pool's last awarded (closed) draw ID
 * @param prizePool instance of the `PrizePool` class
 * @returns
 */
export const useLastDrawId = (prizePool: PrizePool): UseQueryResult<number, unknown> => {
  const queryKey = [QUERY_KEYS.lastDrawId, prizePool?.id]

  return useQuery(queryKey, async () => await prizePool.getLastDrawId(), {
    enabled: !!prizePool,
    ...NO_REFETCH
  })
}
