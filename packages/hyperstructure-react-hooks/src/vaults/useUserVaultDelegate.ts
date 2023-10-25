import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Address } from 'viem'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a user's delegate for a vault
 * @param vault instance of the `Vault` class
 * @param userAddress user address to get delegate for
 * @returns
 */
export const useUserVaultDelegate = (
  vault: Vault,
  userAddress: Address
): UseQueryResult<Address, unknown> => {
  const queryKey = [QUERY_KEYS.userVaultDelegate, userAddress, vault?.id]

  return useQuery(queryKey, async () => await vault.getUserDelegate(userAddress), {
    enabled: !!vault && !!userAddress,
    ...NO_REFETCH
  })
}
