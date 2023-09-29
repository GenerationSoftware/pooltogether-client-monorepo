import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getHistoricalTokenPrices } from '@shared/utilities'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address } from 'viem'
import { QUERY_KEYS } from '../constants'

/**
 * Returns historical token prices in ETH
 * @param chainId chain ID the tokens are in
 * @param tokenAddresses token addresses to query historical prices for
 * @returns
 */
export const useHistoricalTokenPrices = (chainId: number, tokenAddresses: string[]) => {
  const results = useQueries({
    queries: tokenAddresses.map((tokenAddress) => ({
      queryKey: [QUERY_KEYS.historicalTokenPrices, chainId, tokenAddress],
      queryFn: async () => await getHistoricalTokenPrices(chainId, tokenAddress),
      staleTime: Infinity,
      enabled: !!chainId && !!tokenAddress,
      ...NO_REFETCH
    }))
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)
    const refetch = () => results?.forEach((result) => result.refetch())

    const formattedData: { [address: Address]: { date: string; price: number }[] } = {}
    results.forEach((result) => {
      if (!!result.data) {
        const address = Object.keys(result.data)[0] as Address | undefined
        if (!!address) {
          formattedData[address] = result.data[address]
        }
      }
    })

    return { data: formattedData, isFetched, refetch }
  }, [results])
}
