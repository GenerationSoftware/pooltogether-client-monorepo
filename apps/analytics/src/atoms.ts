import { getSecondsSinceEpoch } from '@shared/utilities'
import { atom } from 'jotai'

/**
 * Current timestamp atom
 */
export const currentTimestampAtom = atom<number>(getSecondsSinceEpoch())
