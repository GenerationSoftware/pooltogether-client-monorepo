import { Address } from 'viem'
import { SUPPORTED_NETWORKS } from '@constants/config'

export type SupportedNetwork = (typeof SUPPORTED_NETWORKS)[number]

export interface LiquidationPair {
  chainId: SupportedNetwork
  address: Address
  swapPath: SwapPath
}

export type SwapPath =
  | [Address, number, Address]
  | [Address, number, Address, number, Address]
  | [Address, number, Address, number, Address, number, Address]
