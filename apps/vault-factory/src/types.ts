import { SUPPORTED_NETWORKS } from '@constants/config'

export type SupportedNetwork = (typeof SUPPORTED_NETWORKS)[number]

export type FormKey =
  | 'vaultChainId'
  | 'vaultYieldSourceName'
  | 'vaultYieldSourceAddress'
  | 'vaultOwner'
  | 'vaultFee'
  | 'vaultFeeRecipient'
  | 'vaultName'
  | 'vaultSymbol'
  | 'vaultClaimer'
  | 'vaultYieldBuffer'
  | 'targetAuctionPeriod'
  | 'targetAuctionPrice'
  | 'smoothingFactor'
  | 'deployedVaultChainId'
  | 'deployedVaultAddress'
  | 'lpAddress'
  | 'contributionAmount'

export type VaultState = 'active' | 'invalid' | 'missingLiquidationPair' | 'missingClaimer'

export type YieldSourceVaultTag = 'stablecoin' | 'lp' | 'lst'
