import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Address } from 'viem'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a vault's corresponding TwabController address
 * @param vault instance of the `Vault` class
 * @returns
 */
export const useVaultTwabController = (vault: Vault): UseQueryResult<Address> => {
  const queryKey = [QUERY_KEYS.vaultTwabController, vault?.id]

  return useQuery({
    queryKey,
    queryFn: async () => await vault.getTWABController(),
    enabled: !!vault,
    ...NO_REFETCH
  })
}
