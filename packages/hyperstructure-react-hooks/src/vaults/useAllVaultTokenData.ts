import { Vaults } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { TokenWithSupply } from '@shared/types'
import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { populateCachePerId } from '..'
import { QUERY_KEYS } from '../constants'

/**
 * Returns underlying token data for each vault
 *
 * Stores queried token data in cache
 * @param vaults instance of the `Vaults` class
 * @returns
 */
export const useAllVaultTokenData = (
  vaults: Vaults
): UseQueryResult<{ [vaultId: string]: TokenWithSupply }> => {
  const queryClient = useQueryClient()

  const vaultIds = !!vaults ? Object.keys(vaults.vaults) : []
  const getQueryKey = (val: (string | number)[]) => [QUERY_KEYS.vaultTokenData, val]

  return useQuery({
    queryKey: getQueryKey(vaultIds),
    queryFn: async () => {
      const tokenData = await vaults.getTokenData()

      populateCachePerId(queryClient, getQueryKey, tokenData)

      return tokenData
    },
    enabled: !!vaults,
    ...NO_REFETCH
  })
}
