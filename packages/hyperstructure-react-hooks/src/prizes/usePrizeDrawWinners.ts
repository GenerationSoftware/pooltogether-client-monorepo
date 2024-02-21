import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { SubgraphDraw } from '@shared/types'
import { getPaginatedSubgraphDraws } from '@shared/utilities'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'

/**
 * Returns historical prize pool draws and their winners
 * @param prizePool instance of the `PrizePool` class
 * @param options optional settings
 * @returns
 */
export const usePrizeDrawWinners = (
  prizePool: PrizePool,
  options?: {
    refetchInterval?: number
  }
): UseQueryResult<SubgraphDraw[]> => {
  const queryKey = [QUERY_KEYS.drawWinners, prizePool?.chainId]

  return useQuery({
    queryKey,
    queryFn: async () => await getPaginatedSubgraphDraws(prizePool?.chainId),
    enabled: !!prizePool,
    ...NO_REFETCH,
    refetchInterval: options?.refetchInterval ?? false
  })
}
