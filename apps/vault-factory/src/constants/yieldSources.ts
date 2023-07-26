import { NETWORK } from '@shared/utilities'
import { SupportedNetwork, YieldSourceId } from 'src/types'
import { Address } from 'viem'

/**
 * Default yield sources
 */
export const YIELD_SOURCES: Record<
  SupportedNetwork,
  { [tokenAddress: Address]: { id: YieldSourceId; address: Address }[] }
> = {
  [NETWORK.mainnet]: {},
  [NETWORK.polygon]: {},
  [NETWORK.optimism]: {},
  [NETWORK.arbitrum]: {},
  [NETWORK.sepolia]: {}
}

/**
 * Yield source descriptions
 */
export const YIELD_SOURCE_DESCRIPTIONS: Record<
  YieldSourceId,
  { name: string; href: string; description: string }
> = {
  aave: { name: 'Aave', href: 'https://aave.com/', description: 'TODO' },
  yearn: { name: 'Yearn', href: 'https://yearn.finance/', description: 'TODO' },
  compound: { name: 'Compound', href: 'https://compound.finance/', description: 'TODO' }
}
