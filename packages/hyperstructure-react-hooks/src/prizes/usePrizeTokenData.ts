import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { TokenWithSupply } from '@shared/types'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'

/**
 * Returns basic data about the token awarded by a prize pool
 * @param prizePool instance of the `PrizePool` class
 * @returns
 */
export const usePrizeTokenData = (prizePool: PrizePool): UseQueryResult<TokenWithSupply> => {
  const queryKey = [QUERY_KEYS.prizeTokenData, prizePool?.id]

  return useQuery({
    queryKey,
    queryFn: async () => await prizePool.getPrizeTokenData(),
    enabled: !!prizePool,
    ...NO_REFETCH
  })
}
