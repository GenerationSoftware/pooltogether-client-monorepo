import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { TokenWithSupply } from '@shared/types'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a vault's underlying token data
 * @param vault instance of the `Vault` class
 * @returns
 */
export const useVaultTokenData = (vault: Vault): UseQueryResult<TokenWithSupply> => {
  const queryKey = [QUERY_KEYS.vaultTokenData, vault?.id]

  return useQuery({
    queryKey,
    queryFn: async () => await vault.getTokenData(),
    enabled: !!vault,
    ...NO_REFETCH
  })
}
