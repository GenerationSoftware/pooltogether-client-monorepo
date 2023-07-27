import { useAtomValue } from 'jotai'
import { vaultChainIdAtom, vaultTokenAddressAtom } from 'src/atoms'
import { CONTRACTS } from '@constants/config'

/**
 * Returns default yield sources for the currently selected token
 * @returns
 */
export const useTokenYieldSources = () => {
  const vaultChainId = useAtomValue(vaultChainIdAtom)
  const vaultTokenAddress = useAtomValue(vaultTokenAddressAtom)

  if (!!vaultChainId && !!vaultTokenAddress) {
    return CONTRACTS[vaultChainId].yieldSources[vaultTokenAddress] ?? []
  }

  return []
}
