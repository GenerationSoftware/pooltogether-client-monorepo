import { LiquidationPair } from 'src/types'
import { getEncodedSwapPath } from 'src/utils'
import { usePrepareContractWrite } from 'wagmi'
import { FLASH_LIQUIDATORS } from '@constants/config'
import { flashLiquidatorABI } from '@constants/flashLiquidatorABI'

// TODO: setup auto-refetching
export const useBestLiquidation = (liquidationPair: LiquidationPair) => {
  const chainId = liquidationPair?.chainId
  const lpAddress = liquidationPair?.address

  const swapPath = !!liquidationPair?.swapPath
    ? getEncodedSwapPath(liquidationPair.swapPath)
    : undefined

  const enabled = !!chainId && !!lpAddress && !!swapPath

  const {
    data: quote,
    isFetched,
    refetch: refetchQuote,
    isRefetching
  } = usePrepareContractWrite({
    chainId,
    address: FLASH_LIQUIDATORS[liquidationPair.chainId],
    abi: flashLiquidatorABI,
    functionName: 'findBestQuoteStatic',
    args: [lpAddress, swapPath as `0x${string}`],
    enabled
  })

  const refetch = () => {
    if (!isRefetching) {
      refetchQuote()
    }
  }

  return { data: quote?.result, isFetched, refetch }
}
