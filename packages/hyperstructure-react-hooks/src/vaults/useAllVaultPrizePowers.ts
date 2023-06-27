import { PrizePool, Vaults } from '@pooltogether/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { populateCachePerId } from '..'
import { QUERY_KEYS } from '../constants'

/**
 * Returns each vault's prize power on a given prize pool
 *
 * Stores queried vault prize powers in cache
 * @param vaults instance of the `Vaults` class
 * @param prizePool instance of the `PrizePool` class
 * @param refetchInterval optional automatic refetching interval in ms
 * @returns
 */
export const useAllVaultPrizePowers = (
  vaults: Vaults,
  prizePool: PrizePool,
  refetchInterval?: number
): UseQueryResult<{ [vaultId: string]: number }, unknown> => {
  const queryClient = useQueryClient()

  const vaultIds = !!vaults ? Object.keys(vaults.vaults) : []
  const getQueryKey = (val: (string | number)[]) => [QUERY_KEYS.vaultPrizePower, prizePool?.id, val]

  const vaultAddresses = !!vaults ? Object.values(vaults.vaults).map((vault) => vault.address) : []

  return useQuery(
    getQueryKey(vaultIds),
    async () => await prizePool.getVaultPrizePowers(vaultAddresses),
    {
      enabled: !!vaults && !!prizePool,
      ...NO_REFETCH,
      refetchInterval: refetchInterval ?? false,
      onSuccess: (data) => populateCachePerId(queryClient, getQueryKey, data)
    }
  )
}
