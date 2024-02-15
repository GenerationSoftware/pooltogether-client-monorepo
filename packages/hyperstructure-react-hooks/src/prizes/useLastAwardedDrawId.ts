import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a prize pool's last awarded draw ID
 * @param prizePool instance of the `PrizePool` class
 * @param options optional settings
 * @returns
 */
export const useLastAwardedDrawId = (
  prizePool: PrizePool,
  options?: { refetchInterval?: number }
): UseQueryResult<number> => {
  const queryKey = [QUERY_KEYS.lastAwardedDrawId, prizePool?.id]

  return useQuery({
    queryKey,
    queryFn: async () => await prizePool.getLastAwardedDrawId(),
    enabled: !!prizePool,
    ...NO_REFETCH,
    refetchInterval: options?.refetchInterval ?? false
  })
}
