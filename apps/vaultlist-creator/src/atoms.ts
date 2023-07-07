import { VaultInfo, Version } from '@shared/types'
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
 * Vault List Image
 */
export const listImageAtom = atom<string>('')

/**
 * Vault List Version
 */
export const listVersionAtom = atom<Version>({ major: 1, minor: 0, patch: 0 })

/**
 * Vaults
 */
export const vaultsAtom = atom<VaultInfo[]>([])
