import { NETWORK } from '@shared/utilities'
import { atom } from 'jotai'
import { Address } from 'viem'

/**
 * Vault Chain ID
 */
export const vaultChainIdAtom = atom<NETWORK | undefined>(undefined)

/**
 * Vault Token Address
 */
export const vaultTokenAddressAtom = atom<Address | undefined>(undefined)

/**
 * Vault Yield Source Name
 */
export const vaultYieldSourceNameAtom = atom<string>('')

/**
 * Vault Yield Source Address
 */
export const vaultYieldSourceAddressAtom = atom<Address | undefined>(undefined)

/**
 * Vault Fee Percentage
 */
export const vaultFeePercentageAtom = atom<number | undefined>(undefined)

/**
 * Vault Fee Recipient
 */
export const vaultFeeRecipientAddressAtom = atom<Address | undefined>(undefined)

/**
 * Vault Owner Address
 */
export const vaultOwnerAddressAtom = atom<Address | undefined>(undefined)

/**
 * Vault Name
 */
export const vaultNameAtom = atom<string>('')

/**
 * Vault Symbol
 */
export const vaultSymbolAtom = atom<string>('')

/**
 * Vault Claimer Address
 */
export const vaultClaimerAddressAtom = atom<Address | undefined>(undefined)
