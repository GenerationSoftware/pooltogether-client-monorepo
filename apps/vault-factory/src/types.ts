import { SUPPORTED_NETWORKS } from '@constants/config'

export type SupportedNetwork = (typeof SUPPORTED_NETWORKS)[number]

export type FormKey =
  | 'vaultChainId'
  | 'vaultToken'
  | 'vaultYieldSourceName'
  | 'vaultYieldSourceAddress'
  | 'vaultOwner'
  | 'vaultFee'
  | 'vaultFeeRecipient'
  | 'vaultName'
  | 'vaultSymbol'
  | 'vaultClaimer'
  | 'deployedVaultChainId'
  | 'deployedVaultAddress'

export type YieldSourceId = 'aave' | 'yearn' | 'compound'
