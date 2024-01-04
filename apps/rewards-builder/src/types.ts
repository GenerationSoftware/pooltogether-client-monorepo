import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { PartialPromotionInfo } from '@shared/types'
import { SUPPORTED_NETWORKS } from '@constants/config'

export type SupportedNetwork = (typeof SUPPORTED_NETWORKS)[number]

export type FormKey =
  | 'promotionChainId'
  | 'promotionVaultAddress'
  | 'promotionEpochs'
  | 'promotionEpochLength'
  | 'promotionTokenAddress'
  | 'promotionTokenAmount'
  | 'numExtensionEpochs'

export type Promotion = { chainId: number; id: number; vault: Vault } & Omit<
  PartialPromotionInfo,
  'vault'
>

export type PromotionStatus = 'active' | 'ended' | 'destroyed'
