import { Vaults } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { populateCachePerId } from '..'
import { QUERY_KEYS } from '../constants'

/**
 * Returns each vault's total delegate supply (total supply - sponsored supply)
 * @param vaults instance of the `Vaults` class
 * @returns
 */
export const useAllVaultTotalDelegateSupplies = (vaults: Vaults) => {
  const queryClient = useQueryClient()

  const vaultIds = !!vaults ? Object.keys(vaults.vaults) : []
  const getQueryKey = (val: (string | number)[]) => [QUERY_KEYS.vaultTotalDelegateSupplies, val]

  return useQuery({
    queryKey: getQueryKey(vaultIds),
    queryFn: async () => {
      const totalDelegateSupply = await vaults.getTotalDelegateSupplies()

      populateCachePerId(queryClient, getQueryKey, totalDelegateSupply)

      return totalDelegateSupply
    },
    enabled: !!vaults,
    ...NO_REFETCH
  })
}
