import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getPaginatedSubgraphWalletAddresses } from '@shared/utilities'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Address } from 'viem'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a prize pool's unique wallet addresses
 * @param prizePool instance of the `PrizePool` class
 * @param options optional settings
 * @returns
 */
export const useWalletAddresses = (
  prizePool: PrizePool,
  options?: { activeWalletsOnly?: boolean }
): UseQueryResult<Lowercase<Address>[]> => {
  const queryKey = [
    QUERY_KEYS.walletAddresses,
    prizePool?.chainId,
    options?.activeWalletsOnly ?? false
  ]

  return useQuery({
    queryKey,
    queryFn: async () => await getPaginatedSubgraphWalletAddresses(prizePool.chainId, options),
    enabled: !!prizePool,
    ...NO_REFETCH
  })
}
