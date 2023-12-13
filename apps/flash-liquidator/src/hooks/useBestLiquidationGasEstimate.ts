import {
  useGasAmountEstimate,
  useGasCostEstimates
} from '@generationsoftware/hyperstructure-react-hooks'
import { GasCostEstimates } from '@shared/types'
import { getSecondsSinceEpoch, SECONDS_PER_MINUTE } from '@shared/utilities'
import { useMemo } from 'react'
import { LiquidationPair } from 'src/types'
import { getEncodedSwapPath } from 'src/utils'
import { Address, zeroAddress } from 'viem'
import { FLASH_LIQUIDATORS } from '@constants/config'
import { flashLiquidatorABI } from '@constants/flashLiquidatorABI'
import { useBestLiquidation } from './useBestLiquidation'

export const useBestLiquidationGasEstimate = (
  liquidationPair: LiquidationPair
): {
  data: GasCostEstimates | undefined
  isFetched: boolean
} => {
  const { data: bestLiquidation, isFetched: isFetchedBestLiquidation } =
    useBestLiquidation(liquidationPair)

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

  const { data: gasAmount, isFetched: isFetchedGasAmount } = useGasAmountEstimate(
    liquidationPair.chainId,
    {
      address: FLASH_LIQUIDATORS[liquidationPair.chainId],
      abi: flashLiquidatorABI,
      functionName: 'flashLiquidate',
      args,
      account: zeroAddress
    },
    { enabled: !!args && bestLiquidation?.success }
  )

  const tx = !!args ? { abi: flashLiquidatorABI, functionName: 'flashLiquidate', args } : undefined
  const fallbackGasAmount = 400_000n + BigInt(((liquidationPair.swapPath.length - 1) / 2) * 100_000)

  const { data: gasCost, isFetched: isFetchedGasCost } = useGasCostEstimates(
    liquidationPair.chainId,
    gasAmount ?? fallbackGasAmount,
    { tx }
  )

  const isFetched =
    isFetchedBestLiquidation &&
    (!args || !bestLiquidation?.success || (isFetchedGasAmount && !!gasAmount)) &&
    isFetchedGasCost &&
    !!gasCost

  return { data: gasCost, isFetched }
}
