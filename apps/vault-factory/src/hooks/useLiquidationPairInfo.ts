import {
  useFirstDrawOpenedAt,
  usePrizePool,
  useVault,
  useVaultShareData
} from '@generationsoftware/hyperstructure-react-hooks'
import { PairCreateInfo } from '@shared/types'
import { POOL_TOKEN_ADDRESSES, PRIZE_POOLS } from '@shared/utilities'
import { useAtomValue } from 'jotai'
import {
  liquidationPairInitialAmountInAtom,
  liquidationPairMinimumAuctionAmountAtom
} from 'src/atoms'
import { SupportedNetwork } from 'src/types'
import { Address, parseEther, parseUnits } from 'viem'
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
  const { data: shareToken } = useVaultShareData(vault)

  const prizePoolInfo = PRIZE_POOLS.find((pool) => pool.chainId === chainId) as {
    chainId: SupportedNetwork
    address: Address
    options: { prizeTokenAddress: Address; drawPeriodInSeconds: number; tierShares: number }
  }

  const prizePool = usePrizePool(chainId, prizePoolInfo.address)
  const { data: periodOffset } = useFirstDrawOpenedAt(prizePool)

  const periodLength = prizePoolInfo.options.drawPeriodInSeconds
  const targetFirstSaleTime = LP_CONFIG[chainId].targetFirstSaleTimeFraction * periodLength

  const decayConstant = parseEther('134') / BigInt(periodLength * 50)

  const initialAmountOut = !!shareToken ? parseUnits('1', shareToken.decimals) : undefined

  return {
    chainId,
    source: vaultAddress,
    tokenIn: POOL_TOKEN_ADDRESSES[chainId],
    tokenOut: vaultAddress,
    periodLength,
    periodOffset,
    targetFirstSaleTime,
    decayConstant,
    initialAmountIn,
    initialAmountOut,
    minimumAuctionAmount
  }
}
