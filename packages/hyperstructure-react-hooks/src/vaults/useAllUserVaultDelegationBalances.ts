import { Vaults } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { populateCachePerId } from '..'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a user's delegation balance in each vault
 *
 * NOTE: This is the amount delegated to the user, including their own deposits
 *
 * Stores queried vault balances in cache
 * @param vaults instance of the `Vaults` class
 * @param userAddress user address to get balances for
 * @param options optional settings
 * @returns
 */
export const useAllUserVaultDelegationBalances = (
  vaults: Vaults,
  userAddress: string,
  options?: {
    refetchInterval?: number
    refetchOnWindowFocus?: boolean
  }
): UseQueryResult<{ [vaultId: string]: bigint }> => {
  const queryClient = useQueryClient()

  const vaultIds = !!vaults ? Object.keys(vaults.vaults) : []
  const getQueryKey = (val: (string | number)[]) => [
    QUERY_KEYS.userVaultDelegationBalances,
    userAddress,
    val
  ]

  return useQuery({
    queryKey: getQueryKey(vaultIds),
    queryFn: async () => {
      const userDelegateBalances = await vaults.getUserDelegateBalances(userAddress)

      populateCachePerId(queryClient, getQueryKey, userDelegateBalances)

      return userDelegateBalances
    },
    enabled: !!vaults && !!userAddress,
    ...NO_REFETCH,
    refetchInterval: options?.refetchInterval ?? false,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false
  })
}
