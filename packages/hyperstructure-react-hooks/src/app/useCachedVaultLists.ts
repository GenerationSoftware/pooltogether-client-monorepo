import { VaultList } from '@pooltogether/hyperstructure-client-js'
import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'
import { LOCAL_STORAGE_KEYS } from '../constants'

const getInitialCachedVaultLists = (): { [id: string]: VaultList } => {
  if (typeof window === 'undefined') return {}
  const cachedVaultLists = localStorage.getItem(LOCAL_STORAGE_KEYS.cachedVaultLists)
  return JSON.parse(cachedVaultLists ?? '{}')
}

const cachedVaultListsAtom = atom<{ [id: string]: VaultList | undefined }>(
  getInitialCachedVaultLists()
)

// TODO: use service worker cache instead of localstorage to store cached vault lists
/**
 * Returns currently cached vault lists
 *
 * Stores state in local storage
 * @returns
 */
export const useCachedVaultLists = () => {
  const [cachedVaultLists, setCachedVaultLists] = useAtom(cachedVaultListsAtom)

  const set = (vaultLists: { [id: string]: VaultList }) => {
    setCachedVaultLists(vaultLists)
  }

  const cache = (id: string, vaultList: VaultList) => {
    setCachedVaultLists((prev) => ({ ...prev, [id]: vaultList }))
  }

  const remove = (id: string) => {
    setCachedVaultLists((prev) => ({ ...prev, [id]: undefined }))
  }

  const clear = () => {
    setCachedVaultLists({})
  }

  useEffect(
    () =>
      localStorage.setItem(LOCAL_STORAGE_KEYS.cachedVaultLists, JSON.stringify(cachedVaultLists)),
    [cachedVaultLists]
  )

  return {
    cachedVaultLists,
    set,
    cache,
    remove,
    clear
  }
}
