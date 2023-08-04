import { PrizePool, sToMs } from '@pooltogether/hyperstructure-client-js'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { useDrawPeriod } from '..'
import { QUERY_KEYS } from '../constants'

/**
 * Returns the start and end timestamps of a prize pool's last draw (in seconds)
 * @param prizePool instance of the `PrizePool` class
 * @param refetchInterval optional refetch interval in ms (default is 300000ms or 5mins)
 * @returns
 */
export const useLastDrawTimestamps = (
  prizePool: PrizePool,
  refetchInterval?: number
): UseQueryResult<{ start: number; end: number }, unknown> => {
  const { data: drawPeriod, isFetched: isFetchedDrawPeriod } = useDrawPeriod(prizePool)

  const enabled = !!prizePool && isFetchedDrawPeriod && drawPeriod !== undefined

  const queryKey = [QUERY_KEYS.lastDrawTimestamp, prizePool?.id]

  return useQuery(
    queryKey,
    async () => {
      const start = await prizePool.getLastDrawStartTimestamp()
      const end = start + (drawPeriod ?? 0)
      return { start, end }
    },
    {
      refetchInterval: refetchInterval ?? sToMs(300),
      enabled
    }
  )
}
