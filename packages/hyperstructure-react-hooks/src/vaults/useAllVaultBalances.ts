import { Vaults } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { TokenWithAmount } from '@shared/types'
import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { populateCachePerId } from '..'
import { QUERY_KEYS } from '../constants'

/**
 * Returns the total underlying token balance deposited in each vault
 *
 * Stores queried balances in cache
 * @param vaults instance of the `Vaults` class
 * @param refetchInterval optional automatic refetching interval in ms
 * @returns
 */
export const useAllVaultBalances = (
  vaults: Vaults,
  refetchInterval?: number
): UseQueryResult<{ [vaultId: string]: TokenWithAmount }> => {
  const queryClient = useQueryClient()

  const vaultIds = !!vaults ? Object.keys(vaults.vaults) : []
  const getQueryKey = (val: (string | number)[]) => [QUERY_KEYS.vaultBalances, val]

  return useQuery({
    queryKey: getQueryKey(vaultIds),
    queryFn: async () => {
      const totalTokenBalances = await vaults.getTotalTokenBalances()

      populateCachePerId(queryClient, getQueryKey, totalTokenBalances)

      return totalTokenBalances
    },
    enabled: !!vaults,
    ...NO_REFETCH,
    refetchInterval: refetchInterval ?? false
  })
}
