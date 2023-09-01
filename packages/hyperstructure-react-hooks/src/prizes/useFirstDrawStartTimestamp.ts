import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'

/**
 * Returns the start timestamps of a prize pool's first ever draw (in seconds)
 * @param prizePool instance of the `PrizePool` class
 * @returns
 */
export const useFirstDrawStartTimestamp = (
  prizePool: PrizePool
): UseQueryResult<number, unknown> => {
  const queryKey = [QUERY_KEYS.firstDrawStartTimestamp, prizePool?.id]

  return useQuery(
    queryKey,
    async () => {
      const timestamp = await prizePool.getFirstDrawStartTimestamp()
      return timestamp
    },
    {
      enabled: !!prizePool
    }
  )
}
