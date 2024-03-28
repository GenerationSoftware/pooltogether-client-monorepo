import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a prize pool's draw auction duration (in seconds)
 * @param prizePool instance of the `PrizePool` class
 * @returns
 */
export const useDrawAuctionDuration = (prizePool: PrizePool): UseQueryResult<number> => {
  const queryKey = [QUERY_KEYS.drawAuctionDuration, prizePool?.id]

  return useQuery({
    queryKey,
    queryFn: async () => await prizePool.getDrawAuctionDurationInSeconds(),
    enabled: !!prizePool,
    ...NO_REFETCH
  })
}
