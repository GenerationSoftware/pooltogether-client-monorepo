import { getSecondsSinceEpoch, SECONDS_PER_HOUR } from '@shared/utilities'
import { atom } from 'jotai'
import { Address } from 'viem'
import { SupportedNetwork } from './types'

/**
 * Promotion Chain ID
 */
export const promotionChainIdAtom = atom<SupportedNetwork | undefined>(undefined)

/**
 * Promotion Vault Address
 */
export const promotionVaultAddressAtom = atom<Address | undefined>(undefined)

// TODO: ideally this default does not assume the twab rewards contract offset is 1 hour
/**
 * Promotion Start Timestamp
 */
export const promotionStartTimestampAtom = atom<bigint>(
  BigInt(Math.ceil(getSecondsSinceEpoch() / SECONDS_PER_HOUR) * SECONDS_PER_HOUR)
)

/**
 * Promotion Epochs
 */
export const promotionEpochsAtom = atom<number | undefined>(undefined)

/**
 * Promotion Epoch Length
 */
export const promotionEpochLengthAtom = atom<number | undefined>(undefined)

/**
 * Promotion Token Address
 */
export const promotionTokenAddressAtom = atom<Address | undefined>(undefined)

/**
 * Promotion Token Amount
 */
export const promotionTokenAmountAtom = atom<bigint | undefined>(undefined)

/**
 * Promotion Creation Step Counter
 */
export const promotionCreationStepCounterAtom = atom<number>(0)
