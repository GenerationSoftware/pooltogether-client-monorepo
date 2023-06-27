import { Version } from './contracts'

/**
 * Vault list interface, compatible with Uniswap's token lists (https://tokenlists.org/)
 */
export interface VaultList {
  readonly name: string
  readonly version: Version
  readonly timestamp: string
  readonly tokens: VaultInfo[]
  readonly keywords?: string[]
  readonly tags?: VaultListTags
  readonly logoURI?: string
}

export interface VaultInfo {
  readonly chainId: number
  readonly address: `0x${string}`
  readonly name?: string
  readonly decimals?: number
  readonly symbol?: string
  readonly extensions?: VaultExtensions
  readonly tags?: string[]
  readonly logoURI?: string
}

export interface VaultExtensions {
  readonly underlyingAsset?: {
    readonly address?: `0x${string}`
    readonly symbol?: string
    readonly name?: string
    readonly logoURI?: string
  }
  readonly [key: string]:
    | {
        [key: string]:
          | {
              [key: string]: VaultExtensionValue
            }
          | VaultExtensionValue
      }
    | VaultExtensionValue
}

export type VaultExtensionValue = string | number | boolean | null | undefined

export interface VaultListTags {
  readonly [tagId: string]: {
    readonly name: string
    readonly description: string
  }
}
