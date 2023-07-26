import { useAtomValue } from 'jotai'
import { vaultChainIdAtom, vaultTokenAddressAtom } from 'src/atoms'
import { YIELD_SOURCES } from '@constants/yieldSources'

/**
 * Returns default yield sources for the currently selected token
 * @returns
 */
export const useTokenYieldSources = () => {
  const vaultChainId = useAtomValue(vaultChainIdAtom)
  const vaultTokenAddress = useAtomValue(vaultTokenAddressAtom)

  if (!!vaultChainId && !!vaultTokenAddress) {
    return YIELD_SOURCES[vaultChainId][vaultTokenAddress] ?? []
  }

  return []
}
