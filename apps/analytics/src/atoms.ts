import { atom } from 'jotai'

/**
 * Current timestamp atom
 */
export const currentTimestampAtom = atom<number>(Math.floor(Date.now() / 1_000))
