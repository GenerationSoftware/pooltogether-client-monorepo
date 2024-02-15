import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { useDrawPeriod } from '..'
import { QUERY_KEYS } from '../constants'

/**
 * Returns the open and close timestamps of a prize pool's last awarded draw (in seconds)
 * @param prizePool instance of the `PrizePool` class
 * @param refetchInterval optional refetch interval in ms
 * @returns
 */
export const useLastAwardedDrawTimestamps = (
  prizePool: PrizePool,
  refetchInterval?: number
): UseQueryResult<{ openedAt: number; closedAt: number }> => {
  const { data: drawPeriod, isFetched: isFetchedDrawPeriod } = useDrawPeriod(prizePool)

  const enabled = !!prizePool && isFetchedDrawPeriod && drawPeriod !== undefined

  const queryKey = [QUERY_KEYS.lastAwardedDrawTimestamps, prizePool?.id]

  return useQuery({
    queryKey,
    queryFn: async () => {
      const openedAt = await prizePool.getLastAwardedDrawOpenedAt()
      const closedAt = openedAt + (drawPeriod as number)
      return { openedAt, closedAt }
    },
    enabled,
    ...NO_REFETCH,
    refetchInterval: refetchInterval ?? false
  })
}
