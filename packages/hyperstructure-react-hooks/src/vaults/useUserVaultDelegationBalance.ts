import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Address } from 'viem'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a user's delegation balance in a vault
 *
 * NOTE: This is the amount delegated to the user, including their own deposits
 * @param vault instance of the `Vault` class
 * @param userAddress user address to get balance for
 * @param refetchInterval optional automatic refetching interval in ms
 * @returns
 */
export const useUserVaultDelegationBalance = (
  vault: Vault,
  userAddress: Address,
  refetchInterval?: number
): UseQueryResult<bigint> => {
  const queryKey = [QUERY_KEYS.userVaultDelegationBalances, userAddress, vault?.id]

  return useQuery({
    queryKey,
    queryFn: async () => await vault.getUserDelegateBalance(userAddress),
    enabled: !!vault && !!userAddress,
    ...NO_REFETCH,
    refetchInterval: refetchInterval ?? false
  })
}
