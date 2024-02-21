import { Vaults } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { populateCachePerId } from '..'
import { QUERY_KEYS } from '../constants'

/**
 * Returns exchange rates to calculate shares to assets in each vault
 *
 * Stores queried exchange rates in cache
 * @param vaults instance of the `Vaults` class
 * @param refetchInterval optional automatic refetching interval in ms
 * @returns
 */
export const useAllVaultExchangeRates = (
  vaults: Vaults,
  refetchInterval?: number
): UseQueryResult<{ [vaultId: string]: bigint }> => {
  const queryClient = useQueryClient()

  const vaultIds = !!vaults ? Object.keys(vaults.vaults) : []
  const getQueryKey = (val: (string | number)[]) => [QUERY_KEYS.vaultExchangeRates, val]

  return useQuery({
    queryKey: getQueryKey(vaultIds),
    queryFn: async () => {
      const exchangeRates = await vaults.getExchangeRates()

      populateCachePerId(queryClient, getQueryKey, exchangeRates)

      return exchangeRates
    },
    enabled: !!vaults,
    ...NO_REFETCH,
    refetchInterval: refetchInterval ?? false
  })
}
