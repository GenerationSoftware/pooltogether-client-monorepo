import { NO_REFETCH } from '@shared/generic-react-hooks'
import { sToMs } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { LiquidationPair } from 'src/types'
import { getEncodedSwapPath } from 'src/utils'
import { usePublicClient } from 'wagmi'
import { FLASH_LIQUIDATORS } from '@constants/config'
import { flashLiquidatorABI } from '@constants/flashLiquidatorABI'

export const useBestLiquidation = (liquidationPair: LiquidationPair) => {
  const chainId = liquidationPair?.chainId
  const lpAddress = liquidationPair?.address

  const swapPath = !!liquidationPair?.swapPath
    ? getEncodedSwapPath(liquidationPair.swapPath)
    : undefined

  const publicClient = usePublicClient({ chainId })

  const queryKey = ['liquidationQuote', chainId, lpAddress]

  const {
    data: quote,
    isFetched,
    refetch: refetchQuote,
    isRefetching
  } = useQuery(
    queryKey,
    async () => {
      if (!!swapPath) {
        const quote = await publicClient.readContract({
          address: FLASH_LIQUIDATORS[liquidationPair.chainId],
          abi: flashLiquidatorABI,
          // @ts-ignore
          functionName: 'findBestQuoteStatic',
          args: [lpAddress, swapPath]
        })
        return quote
      }
    },
    {
      enabled: !!chainId && !!lpAddress && !!swapPath && !!publicClient,
      ...NO_REFETCH,
      refetchInterval: sToMs(30)
    }
  )

  const refetch = () => {
    if (!isRefetching) {
      refetchQuote()
    }
  }

  return { data: quote, isFetched, refetch }
}
