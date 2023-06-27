import { VaultList } from '@pooltogether/hyperstructure-client-js'
import { useMemo } from 'react'
import { useCachedVaultLists, useSelectedVaultListIds } from '..'

/**
 * Returns currently selected local and imported vault lists
 * @returns
 */
export const useSelectedVaultLists = () => {
  const { localIds, importedIds } = useSelectedVaultListIds()
  const { cachedVaultLists } = useCachedVaultLists()

  const localVaultLists = useMemo(() => {
    const vaultLists: { [id: string]: VaultList } = {}
    localIds.forEach((id) => {
      const vaultList = cachedVaultLists[id]
      if (!!vaultList) {
        vaultLists[id] = vaultList
      }
    })
    return vaultLists
  }, [localIds, cachedVaultLists])

  const importedVaultLists = useMemo(() => {
    const vaultLists: { [id: string]: VaultList } = {}
    importedIds.forEach((id) => {
      const vaultList = cachedVaultLists[id]
      if (!!vaultList) {
        vaultLists[id] = vaultList
      }
    })
    return vaultLists
  }, [importedIds, cachedVaultLists])

  return { localVaultLists, importedVaultLists }
}
