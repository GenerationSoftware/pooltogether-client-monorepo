import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { VaultInfo } from '@shared/types'
import { PublicClient } from 'viem'
import { usePublicClient } from 'wagmi'

/**
 * Returns an instance of a `Vault` class
 * @param vaultInfo a vault's info
 * @returns
 */
export const useVault = (vaultInfo: VaultInfo): Vault => {
  const publicClient = usePublicClient({ chainId: vaultInfo.chainId })

  return new Vault(vaultInfo.chainId, vaultInfo.address, publicClient as PublicClient, {
    decimals: vaultInfo.decimals,
    tokenAddress: vaultInfo.extensions?.underlyingAsset?.address,
    name: vaultInfo.name,
    logoURI: vaultInfo.logoURI,
    tags: vaultInfo.tags,
    tokenLogoURI: vaultInfo.extensions?.underlyingAsset?.logoURI,
    yieldSourceName: vaultInfo.extensions?.yieldSource?.name,
    yieldSourceURI: vaultInfo.extensions?.yieldSource?.appURI
  })
}
