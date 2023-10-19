import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'

/**
 * Returns the opened at timestamp of a prize pool's first ever draw (in seconds)
 * @param prizePool instance of the `PrizePool` class
 * @returns
 */
export const useFirstDrawOpenedAt = (prizePool: PrizePool): UseQueryResult<number, unknown> => {
  const queryKey = [QUERY_KEYS.firstDrawOpenedAt, prizePool?.id]

  return useQuery(
    queryKey,
    async () => {
      const openedAt = await prizePool.getFirstDrawOpenedAt()
      return openedAt
    },
    {
      enabled: !!prizePool,
      ...NO_REFETCH
    }
  )
}
