import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useSelectedVaultLists } from '@generationsoftware/hyperstructure-react-hooks'
import { getVaultId } from '@shared/utilities'
import { useMemo } from 'react'

/**
 * Returns vault lists that import the given vault, if any
 *
 * NOTE: returns no results if the vault is in local (default) vault lists
 * @param vault the vault to check for in imported vault lists
 * @returns
 */
export const useVaultImportedListSrcs = (vault: Vault) => {
  const { localVaultLists, importedVaultLists } = useSelectedVaultLists()

  return useMemo(() => {
    const listsWithVault: { name: string; href: string }[] = []

    if (!!vault) {
      const isOnLocalVaultLists = Object.values(localVaultLists).some((list) => {
        for (const listVault of list.tokens) {
          if (vault.id === getVaultId(listVault)) {
            return true
          }
        }
      })

      if (!isOnLocalVaultLists) {
        Object.entries(importedVaultLists).forEach(([href, list]) => {
          for (const listVault of list.tokens) {
            if (vault.id === getVaultId(listVault)) {
              const name = list.name
              listsWithVault.push({ name, href })
              break
            }
          }
        })
      }
    }

    return listsWithVault
  }, [vault, localVaultLists, importedVaultLists])
}
