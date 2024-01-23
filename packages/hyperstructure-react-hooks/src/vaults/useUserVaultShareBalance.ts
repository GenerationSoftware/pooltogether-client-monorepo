import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { TokenWithAmount } from '@shared/types'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Address } from 'viem'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a user's share balance in a vault
 * @param vault instance of the `Vault` class
 * @param userAddress user address to get balance for
 * @param refetchInterval optional automatic refetching interval in ms
 * @returns
 */
export const useUserVaultShareBalance = (
  vault: Vault,
  userAddress: Address,
  refetchInterval?: number,
  options?: {
    refetchOnWindowFocus?: boolean
  }
): UseQueryResult<TokenWithAmount, unknown> => {
  const queryKey = [QUERY_KEYS.userVaultBalances, userAddress, vault?.id]

  return useQuery(queryKey, async () => await vault.getUserShareBalance(userAddress), {
    enabled: !!vault && !!userAddress,
    ...NO_REFETCH,
    refetchInterval: refetchInterval ?? false,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false
  })
}
