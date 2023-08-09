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
  | 'initialExchangeRate'
  | 'minimumAuctionAmount'
  | 'deployedVaultChainId'
  | 'deployedVaultAddress'
  | 'lpAddress'

export type VaultState = 'active' | 'invalid' | 'missingLiquidationPair' | 'missingClaimer'
