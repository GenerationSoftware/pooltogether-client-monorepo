import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'
import { LOCAL_STORAGE_KEYS } from '../constants/keys'

interface MiscSettings {
  [key: string]: boolean
}

export const getInitialMiscSettings = (): MiscSettings => {
  if (typeof window === 'undefined') return {}
  const cachedMiscSettings = localStorage.getItem(LOCAL_STORAGE_KEYS.miscSettings)
  return JSON.parse(cachedMiscSettings ?? '{}')
}

const miscSettingsAtom = atom<MiscSettings>(getInitialMiscSettings())

/**
 * Returns the state of any misc settings as well as methods to toggle them
 *
 * Stores state in local storage
 * @returns
 */
export const useMiscSettings = (key: string) => {
  const [miscSettings, setMiscSettings] = useAtom(miscSettingsAtom)

  const set = (val: boolean) => {
    setMiscSettings((prev) => ({ ...prev, [key]: val }))
  }

  useEffect(
    () => localStorage.setItem(LOCAL_STORAGE_KEYS.miscSettings, JSON.stringify(miscSettings)),
    [miscSettings]
  )

  const isActive = !!miscSettings[key]

  return { isActive, set }
}
