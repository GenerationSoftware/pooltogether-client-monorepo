import { getSecondsSinceEpoch } from '@shared/utilities'
import { atom } from 'jotai'

/**
 * Current timestamp atom
 */
export const currentTimestampAtom = atom<number>(getSecondsSinceEpoch())

/**
 * Selected draw ID
 */
export const selectedDrawIdAtom = atom<number | undefined>(undefined)
