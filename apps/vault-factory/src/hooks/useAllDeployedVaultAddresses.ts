import { usePublicClientsByChain } from '@generationsoftware/hyperstructure-react-hooks'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getVaultAddressesFromFactory } from '@shared/utilities'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address } from 'viem'
import { SUPPORTED_NETWORKS } from '@constants/config'

/**
 * Returns the addresses of vaults deployed through the factory
 * @returns
 */
export const useAllDeployedVaultAddresses = () => {
  const publicClients = usePublicClientsByChain({ useAll: true })

  const results = useQueries({
    queries: SUPPORTED_NETWORKS.map((chainId) => {
      const publicClient = publicClients[chainId]

      return {
        queryKey: ['vaultAddressesFromFactory', chainId],
        queryFn: async () => await getVaultAddressesFromFactory(publicClient),
        enabled: !!chainId && !!publicClient,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)
    const isFetching = results?.some((result) => result.isFetching)
    const refetch = () => results?.forEach((result) => result.refetch())

    const data: { [chainId: number]: Lowercase<Address>[] } = {}
    results.forEach((result, i) => {
      if (result.status === 'success') {
        data[SUPPORTED_NETWORKS[i]] = result.data
      }
    })

    return { isFetched, isFetching, refetch, data }
  }, [results])
}
