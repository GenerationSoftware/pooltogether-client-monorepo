import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'

/**
 * Returns the vault's total delegate supply (total supply - sponsored supply)
 * @param vault instance of the `Vault` class
 * @returns
 */
export const useVaultTotalDelegateSupply = (vault: Vault): UseQueryResult<bigint> => {
  const queryKey = [QUERY_KEYS.vaultTotalDelegateSupplies, vault?.id]

  return useQuery({
    queryKey,
    queryFn: async () => await vault.getTotalDelegateSupply(),
    enabled: !!vault,
    ...NO_REFETCH
  })
}
