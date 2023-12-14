import { getSecondsSinceEpoch, SECONDS_PER_MINUTE } from '@shared/utilities'
import { useMemo } from 'react'
import { LiquidationPair } from 'src/types'
import { getEncodedSwapPath } from 'src/utils'
import { Address } from 'viem'
import { useBestLiquidation } from './useBestLiquidation'

export const useBestLiquidationArgs = (
  liquidationPair: LiquidationPair,
  options?: { receiver?: Address; simulationOnly?: boolean }
) => {
  const { data: bestLiquidation } = useBestLiquidation(liquidationPair)

  const args = useMemo(():
    | [Address, Address, bigint, bigint, bigint, bigint, `0x${string}`]
    | undefined => {
    if (
      !!liquidationPair &&
      !!bestLiquidation &&
      (!!options?.simulationOnly || !!options?.receiver)
    ) {
      const lpAddress = liquidationPair.address
      const receiver = options?.receiver ?? lpAddress
      const amountOut = bestLiquidation.amountOut
      const amountIn = (bestLiquidation.amountIn * 101n) / 100n
      const profit = (bestLiquidation?.profit * 99n) / 100n
      const deadline = BigInt(getSecondsSinceEpoch() + SECONDS_PER_MINUTE)
      const swapPath = getEncodedSwapPath(liquidationPair.swapPath) as `0x${string}`

      return [lpAddress, receiver, amountOut, amountIn, profit, deadline, swapPath]
    }
  }, [liquidationPair, options, bestLiquidation])

  return args
}
