import { atom } from 'jotai'
import { Address } from 'viem'
import { LOCAL_STORAGE_KEYS } from '@constants/config'
import { SupportedNetwork } from './types'

/**
 * Vault Chain ID
 */
export const vaultChainIdAtom = atom<SupportedNetwork | undefined>(undefined)

/**
 * Vault Yield Source ID
 */
export const vaultYieldSourceIdAtom = atom<string>('')

/**
 * Vault Yield Source Name
 */
export const vaultYieldSourceNameAtom = atom<string>('')

/**
 * Vault Yield Source Address
 */
export const vaultYieldSourceAddressAtom = atom<Address | undefined>(undefined)

/**
 * Custom Vault Yield Source State
 */
export const isUsingCustomYieldSourceAtom = atom<boolean>(false)

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
export const vaultNameAtom = atom<string | undefined>(undefined)

/**
 * Vault Symbol
 */
export const vaultSymbolAtom = atom<string | undefined>(undefined)

/**
 * Vault Claimer Address
 */
export const vaultClaimerAddressAtom = atom<Address | undefined>(undefined)

/**
 * Vault Yield Buffer
 */
export const vaultYieldBufferAtom = atom<bigint | undefined>(undefined)

/**
 * Vault Creation Step Counter
 */
export const vaultCreationStepCounterAtom = atom<number>(0)

/**
 * Vault Address
 */
export const vaultAddressAtom = atom<Address | undefined>(undefined)

/**
 * Deployed Vault IDs
 */
const getInitialVaultIds = (): string[] => {
  if (typeof window === 'undefined') return []
  const cachedVaultAddresses = localStorage.getItem(LOCAL_STORAGE_KEYS.vaultIds)
  if (!!cachedVaultAddresses) {
    return cachedVaultAddresses.split(',')
  } else {
    return []
  }
}
export const vaultIdsAtom = atom<string[]>(getInitialVaultIds())

/**
 * Liquidation Pair Step Counter
 */
export const liquidationPairStepCounterAtom = atom<number>(0)

/**
 * Liquidation Pair Target Auction Period
 */
export const liquidationPairTargetAuctionPeriodAtom = atom<number | undefined>(undefined)

/**
 * Liquidation Pair Target Auction Price
 */
export const liquidationPairTargetAuctionPriceAtom = atom<bigint | undefined>(undefined)

/**
 * Liquidation Pair Smoothing Factor
 */
export const liquidationPairSmoothingFactorAtom = atom<number>(0.5)

/**
 * Liquidation Pair Address
 */
export const liquidationPairAddressAtom = atom<Address | undefined>(undefined)
