import { useToken, useTokenPrices } from '@generationsoftware/hyperstructure-react-hooks'
import { useMemo } from 'react'
import { LiquidationPair } from 'src/types'
import { Address, formatUnits } from 'viem'
import { useBestLiquidation } from './useBestLiquidation'
import { useBestLiquidationGasEstimate } from './useBestLiquidationGasEstimate'

export const useBestLiquidationProfit = (liquidationPair: LiquidationPair) => {
  const { data: bestLiquidation, isFetched: isFetchedBestLiquidation } =
    useBestLiquidation(liquidationPair)

  const { data: gasEstimate, isFetched: isFetchedGasEstimate } =
    useBestLiquidationGasEstimate(liquidationPair)

  const revenueTokenAddress = (
    liquidationPair.swapPath[liquidationPair.swapPath.length - 1] as Address
  ).toLowerCase() as Lowercase<Address>

  const { data: revenueToken, isFetched: isFetchedRevenueToken } = useToken(
    liquidationPair.chainId,
    revenueTokenAddress
  )

  const { data: tokenPrices, isFetched: isFetchedTokenPrices } = useTokenPrices(
    liquidationPair.chainId,
    [revenueTokenAddress]
  )
  const revenueTokenPrice = tokenPrices?.[revenueTokenAddress]

  const data = useMemo(() => {
    if (!!bestLiquidation && !!gasEstimate && !!revenueToken && revenueTokenPrice !== undefined) {
      const revenueValue =
        parseFloat(formatUnits(bestLiquidation.profit, revenueToken.decimals)) * revenueTokenPrice
      return revenueValue - gasEstimate.totalGasEth
    }
  }, [bestLiquidation, gasEstimate, revenueToken, revenueTokenPrice])

  const isFetched =
    isFetchedBestLiquidation &&
    isFetchedGasEstimate &&
    isFetchedRevenueToken &&
    isFetchedTokenPrices

  return { data, isFetched }
}
