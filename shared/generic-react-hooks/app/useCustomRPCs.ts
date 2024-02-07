import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'
import { LOCAL_STORAGE_KEYS } from '../constants/keys'

const getInitialCustomRPCs = (): { [chainId: number]: string | undefined } => {
  if (typeof window === 'undefined') return {}
  const cachedCustomRPCs = localStorage.getItem(LOCAL_STORAGE_KEYS.customRPCs)
  return JSON.parse(cachedCustomRPCs ?? '{}')
}

const cachedCustomRPCsAtom = atom<{ [chainId: string]: string | undefined }>(getInitialCustomRPCs())

/**
 * Returns custom RPC URLs and methods to change them
 *
 * Stores state in local storage
 * @returns
 */
export const useCustomRPCs = () => {
  const [customRPCs, setCustomRPCs] = useAtom(cachedCustomRPCsAtom)

  const set = (chainId: number, customRPC: string) => {
    setCustomRPCs((prev) => ({ ...prev, [chainId]: customRPC }))
  }

  const setAll = (customRPCs: { [chainId: number]: string }) => {
    setCustomRPCs(customRPCs)
  }

  const remove = (chainId: number) => {
    setCustomRPCs((prev) => ({ ...prev, [chainId]: undefined }))
  }

  const clear = () => {
    setCustomRPCs({})
  }

  useEffect(
    () => localStorage.setItem(LOCAL_STORAGE_KEYS.customRPCs, JSON.stringify(customRPCs)),
    [customRPCs]
  )

  return { customRPCs, set, setAll, remove, clear }
}
