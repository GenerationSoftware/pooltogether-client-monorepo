import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'
import { LOCAL_STORAGE_KEYS } from '../constants'

interface PrizesTimestampsAtom {
  [wallet: string]: { [chainId: number]: number }
}

const getInitialLastCheckedPrizesTimestamps = (): PrizesTimestampsAtom => {
  if (typeof window === 'undefined') return {}
  const cachedLastCheckedPrizesTimestamps = localStorage.getItem(
    LOCAL_STORAGE_KEYS.lastCheckedPrizesTimestamps
  )
  return JSON.parse(cachedLastCheckedPrizesTimestamps ?? '{}')
}

const cachedLastCheckedPrizesTimestampsAtom = atom<PrizesTimestampsAtom>(
  getInitialLastCheckedPrizesTimestamps()
)

/**
 * Returns the timestamp of when prizes were checked last for each network, keyed by wallet
 *
 * Stores state in local storage
 * @returns
 */
export const useLastCheckedPrizesTimestamps = (wallet: string) => {
  const [lastCheckedPrizesTimestamps, setLastCheckedPrizesTimestamps] = useAtom(
    cachedLastCheckedPrizesTimestampsAtom
  )

  const set = (chainId: number, timestamp?: number) => {
    setLastCheckedPrizesTimestamps((prev) => ({
      ...prev,
      [wallet.toLowerCase()]: {
        ...prev[wallet.toLowerCase()],
        [chainId]: timestamp ?? Date.now() / 1_000
      }
    }))
  }

  const clear = (chainId: number) => {
    setLastCheckedPrizesTimestamps((prev) => ({
      ...prev,
      [wallet.toLowerCase()]: { ...prev[wallet.toLowerCase()], [chainId]: 0 }
    }))
  }

  const clearWallet = () => {
    setLastCheckedPrizesTimestamps((prev) => ({
      ...prev,
      [wallet.toLowerCase()]: {}
    }))
  }

  const clearAll = () => {
    setLastCheckedPrizesTimestamps({})
  }

  useEffect(
    () =>
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.lastCheckedPrizesTimestamps,
        JSON.stringify(lastCheckedPrizesTimestamps)
      ),
    [lastCheckedPrizesTimestamps]
  )

  const _lastCheckedPrizesTimestamps = !!wallet
    ? lastCheckedPrizesTimestamps[wallet.toLowerCase()] ?? {}
    : {}

  return {
    lastCheckedPrizesTimestamps: _lastCheckedPrizesTimestamps,
    set,
    clear,
    clearWallet,
    clearAll
  }
}
