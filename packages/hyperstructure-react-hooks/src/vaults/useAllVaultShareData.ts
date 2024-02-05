import { Vaults } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { TokenWithSupply } from '@shared/types'
import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { populateCachePerId } from '..'
import { QUERY_KEYS } from '../constants'

/**
 * Returns share data for each vault
 *
 * Stores queried share data in cache
 * @param vaults instance of the `Vaults` class
 * @param options optional settings
 * @returns
 */
export const useAllVaultShareData = (
  vaults: Vaults,
  options?: {
    refetchOnWindowFocus?: boolean
  }
): UseQueryResult<{ [vaultId: string]: TokenWithSupply }, unknown> => {
  const queryClient = useQueryClient()

  const vaultIds = !!vaults ? Object.keys(vaults.vaults) : []
  const getQueryKey = (val: (string | number)[]) => [QUERY_KEYS.vaultShareData, val]

  return useQuery(getQueryKey(vaultIds), async () => await vaults.getShareData(), {
    enabled: !!vaults,
    ...NO_REFETCH,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    onSuccess: (data) => populateCachePerId(queryClient, getQueryKey, data)
  })
}
