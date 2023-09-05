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
export const useLastCheckedPrizesTimestamps = () => {
  const [lastCheckedPrizesTimestamps, setLastCheckedPrizesTimestamps] = useAtom(
    cachedLastCheckedPrizesTimestampsAtom
  )

  const set = (wallet: string, chainId: number, timestamp?: number) => {
    setLastCheckedPrizesTimestamps((prev) => ({
      ...prev,
      [wallet.toLowerCase()]: {
        ...prev[wallet.toLowerCase()],
        [chainId]: timestamp ?? Date.now() / 1_000
      }
    }))
  }

  const clear = (wallet: string, chainId: number) => {
    setLastCheckedPrizesTimestamps((prev) => ({
      ...prev,
      [wallet.toLowerCase()]: { ...prev[wallet.toLowerCase()], [chainId]: 0 }
    }))
  }

  const clearWallet = (wallet: string) => {
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

  return {
    lastCheckedPrizesTimestamps,
    set,
    clear,
    clearWallet,
    clearAll
  }
}
