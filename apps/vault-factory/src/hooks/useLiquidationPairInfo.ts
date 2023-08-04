import {
  useLastDrawTimestamps,
  usePrizePool,
  useVault,
  useVaultSharePrice
} from '@pooltogether/hyperstructure-react-hooks'
import { PairCreateInfo } from '@shared/types'
import { POOL_TOKEN_ADDRESSES, PRIZE_POOLS } from '@shared/utilities'
import { useAtomValue } from 'jotai'
import {
  liquidationPairInitialAmountInAtom,
  liquidationPairMinimumAuctionAmountAtom
} from 'src/atoms'
import { SupportedNetwork } from 'src/types'
import { Address, parseUnits } from 'viem'
import { LP_CONFIG } from '@constants/config'

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
  const initialAmountIn = useAtomValue(liquidationPairInitialAmountInAtom)
  const minimumAuctionAmount = useAtomValue(liquidationPairMinimumAuctionAmountAtom)

  const vault = useVault({ chainId, address: vaultAddress })
  const { data: shareToken } = useVaultSharePrice(vault)

  const prizePoolInfo = PRIZE_POOLS.find((pool) => pool.chainId === chainId) as {
    chainId: SupportedNetwork
    address: Address
    options: { prizeTokenAddress: Address; drawPeriodInSeconds: number; tierShares: number }
  }

  const prizePool = usePrizePool(chainId, prizePoolInfo.address)
  const { data: lastDrawTimestamps } = useLastDrawTimestamps(prizePool)

  const periodLength = prizePoolInfo.options.drawPeriodInSeconds
  const targetFirstSaleTime = LP_CONFIG.targetFirstSaleTimeFraction * periodLength

  const initialAmountOut = !!shareToken ? parseUnits('1', shareToken.decimals) : undefined

  return {
    chainId,
    source: vaultAddress,
    tokenIn: POOL_TOKEN_ADDRESSES[chainId],
    tokenOut: vaultAddress,
    periodLength,
    periodOffset: lastDrawTimestamps?.start,
    targetFirstSaleTime,
    decayConstant: LP_CONFIG.decayConstant,
    initialAmountIn,
    initialAmountOut,
    minimumAuctionAmount
  }
}
