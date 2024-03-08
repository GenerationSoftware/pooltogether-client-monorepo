import {
  useGasAmountEstimate,
  useGasCostEstimates
} from '@generationsoftware/hyperstructure-react-hooks'
import { GasCostEstimates } from '@shared/types'
import { LiquidationPair } from 'src/types'
import { getFallbackGasAmount } from 'src/utils'
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
      args: args as NonNullable<ReturnType<typeof useBestLiquidationArgs>>,
      account: userAddress ?? zeroAddress
    },
    { enabled: !!args && bestLiquidation?.success }
  )

  const { data: gasCost, isFetched: isFetchedGasCost } = useGasCostEstimates(
    liquidationPair.chainId,
    {
      address: FLASH_LIQUIDATORS[liquidationPair.chainId],
      abi: flashLiquidatorABI,
      functionName: 'flashLiquidate',
      args,
      account: userAddress
    },
    { gasAmount: gasAmount ?? getFallbackGasAmount(liquidationPair.swapPath), enabled: !!args }
  )

  const isFetched =
    isFetchedBestLiquidation &&
    (!args || !bestLiquidation?.success || (isFetchedGasAmount && !!gasAmount)) &&
    isFetchedGasCost &&
    !!gasCost

  return { data: gasCost, isFetched }
}
