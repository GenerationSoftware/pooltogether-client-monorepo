import { usePublicClientsByChain } from '@generationsoftware/hyperstructure-react-hooks'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getVaultAddressesFromFactories, NETWORK, VAULT_FACTORY_ADDRESSES } from '@shared/utilities'
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
        queryFn: async () => {
          let vaultAddresses: Lowercase<Address>[] = []

          if (chainId === NETWORK.mainnet) {
            vaultAddresses.push(
              ...(await getVaultAddressesFromFactories(publicClient, {
                factoryAddresses: [
                  VAULT_FACTORY_ADDRESSES[chainId],
                  '0x29c102109D6cb2D866CFEc380E0E10E9a287A75f'
                ]
              }))
            )
          } else if (chainId === NETWORK.optimism) {
            vaultAddresses.push('0xa52e38a9147f5ea9e0c5547376c21c9e3f3e5e1f')

            vaultAddresses.push(
              ...(await getVaultAddressesFromFactories(publicClient, {
                factoryAddresses: [
                  VAULT_FACTORY_ADDRESSES[chainId],
                  '0xF0F151494658baE060034c8f4f199F74910ea806',
                  '0x0c379e9b71ba7079084ada0d1c1aeb85d24dfd39'
                ]
              }))
            )
          } else if (chainId === NETWORK.base) {
            vaultAddresses.push(
              ...(await getVaultAddressesFromFactories(publicClient, {
                factoryAddresses: [
                  VAULT_FACTORY_ADDRESSES[chainId],
                  '0xe32f6344875494ca3643198d87524519dc396ddf'
                ]
              }))
            )
          } else if (chainId === NETWORK.arbitrum) {
            vaultAddresses.push(
              ...(await getVaultAddressesFromFactories(publicClient, {
                factoryAddresses: [
                  VAULT_FACTORY_ADDRESSES[chainId],
                  '0x44be003e55e7ce8a2e0ecc3266f8a9a9de2c07bc'
                ]
              }))
            )
          } else {
            vaultAddresses.push(...(await getVaultAddressesFromFactories(publicClient)))
          }

          return vaultAddresses
        },
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
