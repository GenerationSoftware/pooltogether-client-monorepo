import { TokenWithAmount, Vaults } from '@pooltogether/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { populateCachePerId } from '..'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a user's share balance in each vault
 *
 * Stores queried vault balances in cache
 * @param vaults instance of the `Vaults` class
 * @param userAddress user address to get balances for
 * @param refetchInterval optional automatic refetching interval in ms
 * @returns
 */
export const useAllUserVaultBalances = (
  vaults: Vaults,
  userAddress: string,
  refetchInterval?: number
): UseQueryResult<{ [vaultId: string]: TokenWithAmount }, unknown> => {
  const queryClient = useQueryClient()

  const vaultIds = !!vaults ? Object.keys(vaults.vaults) : []
  const getQueryKey = (val: (string | number)[]) => [QUERY_KEYS.userVaultBalances, userAddress, val]

  return useQuery(
    getQueryKey(vaultIds),
    async () => await vaults.getUserShareBalances(userAddress),
    {
      enabled: !!vaults && !!userAddress,
      ...NO_REFETCH,
      refetchInterval: refetchInterval ?? false,
      onSuccess: (data) => populateCachePerId(queryClient, getQueryKey, data)
    }
  )
}
