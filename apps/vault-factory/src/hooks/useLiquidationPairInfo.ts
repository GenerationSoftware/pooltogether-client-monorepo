import { PairCreateInfo } from '@shared/types'
import { PRIZE_POOLS } from '@shared/utilities'
import { useAtomValue } from 'jotai'
import {
  liquidationPairSmoothingFactorAtom,
  liquidationPairTargetAuctionPeriodAtom,
  liquidationPairTargetAuctionPriceAtom
} from 'src/atoms'
import { SupportedNetwork } from 'src/types'
import { Address } from 'viem'

/**
 * Returns all info required to deploy a new liquidation pair
 * @param chainId chain ID to deploy to
 * @param vaultAddress vault address to configure for
 * @returns
 */
export const useLiquidationPairInfo = (
  chainId: SupportedNetwork,
  vaultAddress: Address
): Partial<PairCreateInfo> => {
  const targetAuctionPeriod = useAtomValue(liquidationPairTargetAuctionPeriodAtom)
  const targetAuctionPrice = useAtomValue(liquidationPairTargetAuctionPriceAtom)
  const smoothingFactor = useAtomValue(liquidationPairSmoothingFactorAtom)

  const prizeTokenAddress = PRIZE_POOLS.find((pool) => pool.chainId === chainId)?.options
    .prizeTokenAddress as Address

  return {
    chainId,
    source: vaultAddress,
    tokenIn: prizeTokenAddress,
    tokenOut: vaultAddress,
    targetAuctionPeriod,
    targetAuctionPrice,
    smoothingFactor
  }
}
