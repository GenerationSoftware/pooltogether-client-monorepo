import { PairCreateInfo } from '@shared/types'
import { POOL_TOKEN_ADDRESSES, PRIZE_POOLS } from '@shared/utilities'
import { useAtomValue } from 'jotai'
import {
  liquidationPairMinimumAuctionAmountAtom,
  liquidationPairSmoothingFactorAtom
} from 'src/atoms'
import { SupportedNetwork } from 'src/types'
import { Address } from 'viem'
import { NETWORK_CONFIG } from '@constants/config'

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
  const minimumAuctionAmount = useAtomValue(liquidationPairMinimumAuctionAmountAtom)
  const smoothingFactor = useAtomValue(liquidationPairSmoothingFactorAtom)

  const prizePoolInfo = PRIZE_POOLS.find(
    (pool) => pool.chainId === chainId
  ) as (typeof PRIZE_POOLS)[number]

  const drawPeriodLength = prizePoolInfo.options.drawPeriodInSeconds
  const targetAuctionPeriod =
    NETWORK_CONFIG[chainId].lp.targetAuctionPeriodFraction * drawPeriodLength

  return {
    chainId,
    source: vaultAddress,
    tokenIn: POOL_TOKEN_ADDRESSES[chainId],
    tokenOut: vaultAddress,
    targetAuctionPeriod,
    minimumAuctionAmount,
    smoothingFactor
  }
}
