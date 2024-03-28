import { useHistoricalTokenPrices, useTokens } from '@generationsoftware/hyperstructure-react-hooks'
import { TokenWithSupply } from '@shared/types'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useLiquidationPairTokenInAddresses } from './useLiquidationPairTokenInAddresses'

export const useHistoricalLiquidationPairTokenInPrices = (
  chainId: number,
  lpAddresses: Address[]
) => {
  const { data: tokenInAddresses, isFetched: isFetchedTokenInAddresses } =
    useLiquidationPairTokenInAddresses(chainId, lpAddresses)

  const { data: tokens, isFetched: isFetchedTokens } = useTokens(
    chainId,
    Object.values(tokenInAddresses)
  )

  const { data: historicalTokenPrices, isFetched: isFetchedHistoricalTokenPrices } =
    useHistoricalTokenPrices(chainId, Object.values(tokenInAddresses))

  const isFetched = isFetchedTokenInAddresses && isFetchedTokens && isFetchedHistoricalTokenPrices

  const data = useMemo(() => {
    const results: {
      [lpAddress: Address]: TokenWithSupply & { priceHistory: { date: string; price: number }[] }
    } = {}

    if (!!tokenInAddresses) {
      Object.entries(tokenInAddresses).forEach(([lpAddress, tokenInAddress]) => {
        const token = tokens?.[tokenInAddress]
        const tokenPrices = historicalTokenPrices?.[tokenInAddress.toLowerCase() as Address]

        if (!!token && !!tokenPrices?.length) {
          results[lpAddress as Address] = { ...token, priceHistory: tokenPrices }
        }
      })
    }

    return results
  }, [chainId, tokenInAddresses, tokens, historicalTokenPrices])

  return { data, isFetched }
}
