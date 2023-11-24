import { SUPPORTED_NETWORKS } from '@constants/config'

export type SupportedNetwork = (typeof SUPPORTED_NETWORKS)[number]

export type FormKey =
  | 'promotionChainId'
  | 'promotionVaultAddress'
  | 'promotionEpochs'
  | 'promotionEpochLength'
  | 'promotionTokenAddress'
  | 'promotionTokenAmount'
