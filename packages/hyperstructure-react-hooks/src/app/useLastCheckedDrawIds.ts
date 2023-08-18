import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'
import { LOCAL_STORAGE_KEYS } from '../constants'

const getInitialLastCheckedDrawIds = (): { [chainId: number]: number } => {
  if (typeof window === 'undefined') return {}
  const cachedLastCheckedDrawIds = localStorage.getItem(LOCAL_STORAGE_KEYS.lastCheckedDrawIds)
  return JSON.parse(cachedLastCheckedDrawIds ?? '{}')
}

const cachedLastCheckedDrawIdsAtom = atom<{ [chainId: number]: number }>(
  getInitialLastCheckedDrawIds()
)

// TODO: this should be keyed by wallet address as well
/**
 * Returns last checked draw IDs for each network
 *
 * Stores state in local storage
 * @returns
 */
export const useLastCheckedDrawIds = () => {
  const [lastCheckedDrawIds, setLastCheckedDrawIds] = useAtom(cachedLastCheckedDrawIdsAtom)

  const set = (chainId: number, drawId: number) => {
    setLastCheckedDrawIds((prev) => ({ ...prev, [chainId]: drawId }))
  }

  const setAll = (drawIds: { [chainId: number]: number }) => {
    setLastCheckedDrawIds(drawIds)
  }

  const clear = (chainId: number) => {
    setLastCheckedDrawIds((prev) => ({ ...prev, [chainId]: 0 }))
  }

  const clearAll = () => {
    setLastCheckedDrawIds({})
  }

  useEffect(
    () =>
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.lastCheckedDrawIds,
        JSON.stringify(lastCheckedDrawIds)
      ),
    [lastCheckedDrawIds]
  )

  return {
    lastCheckedDrawIds,
    set,
    setAll,
    clear,
    clearAll
  }
}
