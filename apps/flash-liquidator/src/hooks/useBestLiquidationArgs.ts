import { getSecondsSinceEpoch, SECONDS_PER_MINUTE } from '@shared/utilities'
import { useMemo } from 'react'
import { LiquidationPair } from 'src/types'
import { getEncodedSwapPath } from 'src/utils'
import { Address } from 'viem'
import { useBestLiquidation } from './useBestLiquidation'

export const useBestLiquidationArgs = (liquidationPair: LiquidationPair) => {
  const { data: bestLiquidation } = useBestLiquidation(liquidationPair)

  const args = useMemo(():
    | [Address, Address, bigint, bigint, bigint, bigint, `0x${string}`]
    | undefined => {
    if (!!liquidationPair && !!bestLiquidation) {
      const lpAddress = liquidationPair.address
      const amountOut = bestLiquidation.amountOut
      const amountIn = (bestLiquidation.amountIn * 101n) / 100n
      const profit = (bestLiquidation?.profit * 99n) / 100n
      const deadline = BigInt(getSecondsSinceEpoch() + SECONDS_PER_MINUTE)
      const swapPath = getEncodedSwapPath(liquidationPair.swapPath) as `0x${string}`

      return [lpAddress, lpAddress, amountOut, amountIn, profit, deadline, swapPath]
    }
  }, [liquidationPair, bestLiquidation])

  return args
}
