import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Address } from 'viem'
import { QUERY_KEYS } from '../constants'

/**
 * Returns the address of the vault's currently set claimer contract
 * @param vault instance of the `Vault` class
 * @returns
 */
export const useVaultClaimer = (vault: Vault): UseQueryResult<Address, unknown> => {
  const vaultId = !!vault ? [vault.id] : []
  const queryKey = [QUERY_KEYS.vaultClaimers, vaultId]

  return useQuery(
    queryKey,
    async () => {
      const claimer = await vault.getClaimer()
      return claimer
    },
    {
      enabled: !!vault,
      ...NO_REFETCH
    }
  )
}
