import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'
import { LOCAL_STORAGE_KEYS } from '../constants/keys'

interface IsDismissed {
  [key: string]: boolean
}

export const getInitialIsDismissed = (): IsDismissed => {
  if (typeof window === 'undefined') return {}
  const cachedIsDismissed = localStorage.getItem(LOCAL_STORAGE_KEYS.isDismissed)
  return JSON.parse(cachedIsDismissed ?? '{}')
}

const isDismissedAtom = atom<IsDismissed>(getInitialIsDismissed())

/**
 * Returns the state of any dismissable item as well as methods to toggle it
 *
 * Stores state in local storage
 * @returns
 */
export const useIsDismissed = (key: string) => {
  const [_isDismissed, _setIsDismissed] = useAtom(isDismissedAtom)

  const dismiss = () => {
    _setIsDismissed((prev) => ({ ...prev, [key]: true }))
  }

  const bringBack = () => {
    _setIsDismissed((prev) => ({ ...prev, [key]: false }))
  }

  useEffect(
    () => localStorage.setItem(LOCAL_STORAGE_KEYS.isDismissed, JSON.stringify(_isDismissed)),
    [_isDismissed]
  )

  const isDismissed = !!_isDismissed[key]

  return { isDismissed, dismiss, bringBack }
}
