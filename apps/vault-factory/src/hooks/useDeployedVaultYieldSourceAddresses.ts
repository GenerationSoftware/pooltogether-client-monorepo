import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { QUERY_KEYS, usePublicClientsByChain } from '@generationsoftware/hyperstructure-react-hooks'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { SupportedNetwork } from 'src/types'
import { Address } from 'viem'
import { useAllDeployedVaultAddresses } from './useAllDeployedVaultAddresses'

/**
 * Returns the yield source addresses of all deployed vaults from a network's factory
 * @returns
 */
export const useDeployedVaultYieldSourceAddresses = (chainId: SupportedNetwork) => {
  const publicClients = usePublicClientsByChain({ useAll: true })

  const { data: allDeployedVaultAddresses, isFetched: isFetchedAllDeployedVaultAddresses } =
    useAllDeployedVaultAddresses()

  const deployedVaultAddresses = allDeployedVaultAddresses[chainId] ?? []

  const results = useQueries({
    queries: deployedVaultAddresses.map((vaultAddress) => {
      const publicClient = publicClients[chainId]

      const vault = new Vault(chainId, vaultAddress, publicClient)

      return {
        queryKey: [QUERY_KEYS.vaultYieldSources, [vault.id]],
        queryFn: async () => await vault.getYieldSource(),
        enabled: !!chainId && !!publicClient && !!vault && isFetchedAllDeployedVaultAddresses,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)
    const isFetching = results?.some((result) => result.isFetching)
    const refetch = () => results?.forEach((result) => result.refetch())

    const data: { [vaultAddress: Lowercase<Address>]: Lowercase<Address> } = {}
    results.forEach((result, i) => {
      if (result.status === 'success') {
        data[deployedVaultAddresses[i]] = result.data.toLowerCase() as Lowercase<Address>
      }
    })

    return { isFetched, isFetching, refetch, data }
  }, [results])
}
