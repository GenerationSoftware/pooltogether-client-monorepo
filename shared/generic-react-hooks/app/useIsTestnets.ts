import { atom, useAtom } from 'jotai'
import { LOCAL_STORAGE_KEYS } from '../constants/keys'

const getInitialIsTestnets = (): boolean => {
  const defaultValue = true
  if (typeof window === 'undefined') return defaultValue
  const cachedIsTestnets = localStorage.getItem(LOCAL_STORAGE_KEYS.isTestnets)
  if (!!cachedIsTestnets) {
    return cachedIsTestnets === 'true'
  } else {
    return defaultValue
  }
}

const isTestnetsAtom = atom<boolean>(getInitialIsTestnets())

/**
 * Returns the state of `isTestnetsAtom` as well as a method to toggle it
 *
 * Stores state in local storage
 * @returns
 */
export const useIsTestnets = () => {
  const [isTestnets, _setIsTestnets] = useAtom(isTestnetsAtom)

  const setIsTestnets = (value: boolean) => {
    if (value) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.isTestnets, 'true')
      _setIsTestnets(true)
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEYS.isTestnets, 'false')
      _setIsTestnets(false)
    }
  }

  return { isTestnets, setIsTestnets }
}
