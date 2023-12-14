import {
  useGasAmountEstimate,
  useGasCostEstimates
} from '@generationsoftware/hyperstructure-react-hooks'
import { GasCostEstimates } from '@shared/types'
import { LiquidationPair } from 'src/types'
import { zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import { FLASH_LIQUIDATORS } from '@constants/config'
import { flashLiquidatorABI } from '@constants/flashLiquidatorABI'
import { useBestLiquidation } from './useBestLiquidation'
import { useBestLiquidationArgs } from './useBestLiquidationArgs'

export const useBestLiquidationGasEstimate = (
  liquidationPair: LiquidationPair
): {
  data: GasCostEstimates | undefined
  isFetched: boolean
} => {
  const { address: userAddress } = useAccount()

  const { data: bestLiquidation, isFetched: isFetchedBestLiquidation } =
    useBestLiquidation(liquidationPair)

  const args = useBestLiquidationArgs(liquidationPair, {
    receiver: userAddress,
    simulationOnly: true
  })

  const { data: gasAmount, isFetched: isFetchedGasAmount } = useGasAmountEstimate(
    liquidationPair.chainId,
    {
      address: FLASH_LIQUIDATORS[liquidationPair.chainId],
      abi: flashLiquidatorABI,
      functionName: 'flashLiquidate',
      args,
      account: userAddress ?? zeroAddress
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
