import { Vaults } from '@generationsoftware/hyperstructure-client-js'
import { VaultInfo } from '@shared/types'
import { usePublicClientsByChain } from '..'

/**
 * Returns an instance of a `Vaults` class
 * @param allVaultInfo array of vaults' info
 * @param options optional settings
 * @returns
 */
export const useVaults = (
  allVaultInfo: VaultInfo[],
  options?: { useAllChains?: boolean }
): Vaults => {
  const publicClients = usePublicClientsByChain({ useAll: options?.useAllChains })

  const vaults = new Vaults(allVaultInfo, publicClients)

  return vaults
}
