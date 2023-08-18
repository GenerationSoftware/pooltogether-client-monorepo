import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'
import { LOCAL_STORAGE_KEYS } from '../constants'

interface DrawIdsAtom {
  [wallet: string]: { [chainId: number]: number }
}

const getInitialLastCheckedDrawIds = (): DrawIdsAtom => {
  if (typeof window === 'undefined') return {}
  const cachedLastCheckedDrawIds = localStorage.getItem(LOCAL_STORAGE_KEYS.lastCheckedDrawIds)
  return JSON.parse(cachedLastCheckedDrawIds ?? '{}')
}

const cachedLastCheckedDrawIdsAtom = atom<DrawIdsAtom>(getInitialLastCheckedDrawIds())

/**
 * Returns last checked draw IDs for each network, keyed by wallet
 *
 * Stores state in local storage
 * @returns
 */
export const useLastCheckedDrawIds = () => {
  const [lastCheckedDrawIds, setLastCheckedDrawIds] = useAtom(cachedLastCheckedDrawIdsAtom)

  const set = (wallet: string, chainId: number, drawId: number) => {
    setLastCheckedDrawIds((prev) => ({
      ...prev,
      [wallet.toLowerCase()]: { ...prev[wallet.toLowerCase()], [chainId]: drawId }
    }))
  }

  const clear = (wallet: string, chainId: number) => {
    setLastCheckedDrawIds((prev) => ({
      ...prev,
      [wallet.toLowerCase()]: { ...prev[wallet.toLowerCase()], [chainId]: 0 }
    }))
  }

  const clearWallet = (wallet: string) => {
    setLastCheckedDrawIds((prev) => ({
      ...prev,
      [wallet.toLowerCase()]: {}
    }))
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
    clear,
    clearWallet,
    clearAll
  }
}
