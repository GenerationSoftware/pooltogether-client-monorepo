import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Address } from 'viem'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a vault's underlying token address
 *
 * Stores queried address in cache
 * @param vault instance of the `Vault` class
 * @returns
 */
export const useVaultTokenAddress = (vault: Vault): UseQueryResult<Address, unknown> => {
  const queryKey = [QUERY_KEYS.vaultTokenAddresses, vault?.id]

  return useQuery(queryKey, async () => await vault.getTokenAddress(), {
    enabled: !!vault,
    ...NO_REFETCH
  })
}
