import { VaultInfo } from '@shared/types'
import { atom } from 'jotai'
import { AppView } from './types'

/**
 * Current App View
 */
export const appViewAtom = atom<AppView>('base')

/**
 * Vault List Name
 */
export const listNameAtom = atom<string>('')

/**
 * Vault List Keywords
 */
export const listKeywordsAtom = atom<Set<string>>(new Set<string>())

/**
 * Vault Image
 */
export const listImageAtom = atom<string>('')

/**
 * Vaults
 */
export const vaultsAtom = atom<VaultInfo[]>([])
