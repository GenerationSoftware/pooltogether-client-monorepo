import { Vaults } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { Address } from 'viem'
import { populateCachePerId } from '..'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a user's delegate for each vault
 *
 * Stores queried vault delegates in cache
 * @param vaults instance of the `Vaults` class
 * @param userAddress user address to get delegates for
 * @param options optional settings
 * @returns
 */
export const useAllUserVaultDelegates = (
  vaults: Vaults,
  userAddress: string,
  options?: {
    refetchInterval?: number
    refetchOnWindowFocus?: boolean
  }
): UseQueryResult<{ [vaultId: string]: Address }> => {
  const queryClient = useQueryClient()

  const vaultIds = !!vaults ? Object.keys(vaults.vaults) : []
  const getQueryKey = (val: (string | number)[]) => [QUERY_KEYS.userVaultDelegate, userAddress, val]

  return useQuery({
    queryKey: getQueryKey(vaultIds),
    queryFn: async () => {
      const userDelegates = await vaults.getUserDelegates(userAddress)

      populateCachePerId(queryClient, getQueryKey, userDelegates)

      return userDelegates
    },
    enabled: !!vaults && !!userAddress,
    ...NO_REFETCH,
    refetchInterval: options?.refetchInterval ?? false,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false
  })
}
