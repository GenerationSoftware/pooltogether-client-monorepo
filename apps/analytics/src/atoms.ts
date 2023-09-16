import { atom } from 'jotai'

/**
 * Current timestamp atom
 */
export const currentTimestampAtom = atom<number>(Math.floor(Date.now() / 1_000))

/**
 * Selected draw ID
 */
export const selectedDrawIdAtom = atom<number | undefined>(undefined)
