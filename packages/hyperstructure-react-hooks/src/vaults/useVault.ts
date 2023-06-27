import { Vault, VaultInfo } from '@pooltogether/hyperstructure-client-js'
import { usePublicClient } from 'wagmi'

/**
 * Returns an instance of a `Vault` class
 * @param vaultInfo a vault's info
 * @returns
 */
export const useVault = (vaultInfo: VaultInfo): Vault => {
  const publicClient = usePublicClient({ chainId: vaultInfo.chainId })

  return new Vault(vaultInfo.chainId, vaultInfo.address, publicClient, {
    decimals: vaultInfo.decimals,
    tokenAddress: vaultInfo.extensions?.underlyingAsset?.address
  })
}
