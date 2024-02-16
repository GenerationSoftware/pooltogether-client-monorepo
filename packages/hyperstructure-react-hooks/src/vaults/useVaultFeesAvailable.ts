import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'

/**
 * Returns the vault's currently available fee balance to claim
 * @param vault instance of the `Vault` class
 * @returns
 */
export const useVaultFeesAvailable = (vault: Vault): UseQueryResult<bigint> => {
  const vaultId = !!vault ? [vault.id] : []
  const queryKey = [QUERY_KEYS.vaultFeesAvailable, vaultId]

  return useQuery({
    queryKey,
    queryFn: async () => await vault.getFeesAvailable(),
    enabled: !!vault,
    ...NO_REFETCH
  })
}
