import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'
import { LOCAL_STORAGE_KEYS } from '../constants'

type VaultListType = 'local' | 'imported'

const getInitialCachedVaultListIds = (type: VaultListType): string[] => {
  if (typeof window === 'undefined') return []
  switch (type) {
    case 'local': {
      const cachedVaultListIds = localStorage.getItem(LOCAL_STORAGE_KEYS.localVaultListIds)
      return JSON.parse(cachedVaultListIds ?? '[]')
    }
    case 'imported': {
      const cachedVaultListIds = localStorage.getItem(LOCAL_STORAGE_KEYS.importedVaultListIds)
      return JSON.parse(cachedVaultListIds ?? '[]')
    }
  }
}

const cachedLocalVaultListIds = atom<string[]>(getInitialCachedVaultListIds('local'))
const cachedImportedVaultListIds = atom<string[]>(getInitialCachedVaultListIds('imported'))

/**
 * Returns currently selected local and imported vault list IDs
 *
 * Stores state in local storage
 * @returns
 */
export const useSelectedVaultListIds = () => {
  const [localIds, setLocalIds] = useAtom(cachedLocalVaultListIds)
  const [importedIds, setImportedIds] = useAtom(cachedImportedVaultListIds)

  const set = (ids: { local?: string[]; imported?: string[] }) => {
    if (!!ids.local) {
      setLocalIds(ids.local)
    }
    if (!!ids.imported) {
      setImportedIds(ids.imported)
    }
  }

  const select = (id: string, type: VaultListType) => {
    switch (type) {
      case 'local': {
        if (!localIds.includes(id)) {
          setLocalIds((prev) => Array.from(new Set<string>([...prev, id])))
        }
        break
      }
      case 'imported': {
        if (!importedIds.includes(id)) {
          setImportedIds((prev) => Array.from(new Set<string>([...prev, id])))
        }
        break
      }
    }
  }

  const unselect = (id: string, type: VaultListType) => {
    switch (type) {
      case 'local': {
        setLocalIds((prev) => prev.filter((prevId) => prevId !== id))
        break
      }
      case 'imported': {
        setImportedIds((prev) => prev.filter((prevId) => prevId !== id))
        break
      }
    }
  }

  useEffect(
    () => localStorage.setItem(LOCAL_STORAGE_KEYS.localVaultListIds, JSON.stringify(localIds)),
    [localIds]
  )

  useEffect(
    () =>
      localStorage.setItem(LOCAL_STORAGE_KEYS.importedVaultListIds, JSON.stringify(importedIds)),
    [importedIds]
  )

  return { localIds, importedIds, set, select, unselect }
}
