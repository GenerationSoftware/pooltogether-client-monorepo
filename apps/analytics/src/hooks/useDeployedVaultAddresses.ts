import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getVaultAddressesFromFactories, NETWORK, VAULT_FACTORY_ADDRESSES } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'

export const useDeployedVaultAddresses = (prizePool: PrizePool) => {
  return useQuery({
    queryKey: ['deployedVaultAddresses', prizePool?.id],
    queryFn: async () => {
      let vaultAddresses: Lowercase<Address>[] = []

      if (prizePool.chainId === NETWORK.optimism) {
        vaultAddresses.push('0xa52e38a9147f5ea9e0c5547376c21c9e3f3e5e1f')

        vaultAddresses.push(
          ...(await getVaultAddressesFromFactories(prizePool.publicClient, {
            factoryAddresses: [
              VAULT_FACTORY_ADDRESSES[prizePool.chainId],
              '0xF0F151494658baE060034c8f4f199F74910ea806',
              '0x0c379e9b71ba7079084ada0d1c1aeb85d24dfd39'
            ]
          }))
        )
      } else if (prizePool.chainId === NETWORK.base) {
        vaultAddresses.push(
          ...(await getVaultAddressesFromFactories(prizePool.publicClient, {
            factoryAddresses: [
              VAULT_FACTORY_ADDRESSES[prizePool.chainId],
              '0xe32f6344875494ca3643198d87524519dc396ddf'
            ]
          }))
        )
      } else if (prizePool.chainId === NETWORK.arbitrum) {
        vaultAddresses.push(
          ...(await getVaultAddressesFromFactories(prizePool.publicClient, {
            factoryAddresses: [
              VAULT_FACTORY_ADDRESSES[prizePool.chainId],
              '0x44be003e55e7ce8a2e0ecc3266f8a9a9de2c07bc'
            ]
          }))
        )
      } else {
        vaultAddresses.push(...(await getVaultAddressesFromFactories(prizePool.publicClient)))
      }

      return vaultAddresses
    },
    enabled: !!prizePool,
    ...NO_REFETCH
  })
}
