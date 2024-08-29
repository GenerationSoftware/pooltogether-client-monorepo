import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'

/**
 * Returns the number of draws targeted to distribute the grand prize
 * @param prizePool instance of the `PrizePool` class
 * @returns
 */
export const useGrandPrizePeriodDraws = (prizePool: PrizePool) => {
  const queryKey = [QUERY_KEYS.grandPrizePeriodDraws, prizePool?.id]

  return useQuery({
    queryKey,
    queryFn: async () => await prizePool.getGrandPrizePeriodDraws(),
    enabled: !!prizePool,
    ...NO_REFETCH
  })
}
