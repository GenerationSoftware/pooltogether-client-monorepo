import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getTokenPrices } from '@shared/utilities'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address } from 'viem'
import { QUERY_KEYS } from '../constants'

/**
 * Returns token prices in ETH across many chains
 * @param tokenAddresses token addresses to query prices for, indexed by chain ID
 * @returns
 */
export const useTokenPricesAcrossChains = (tokenAddresses: { [chainId: number]: string[] }) => {
  const chainIds = Object.keys(tokenAddresses).map((chainId) => parseInt(chainId))

  const results = useQueries({
    queries: chainIds.map((chainId) => {
      const enabled = !!chainId && !!tokenAddresses?.[chainId] && tokenAddresses[chainId].length > 0

      return {
        queryKey: [QUERY_KEYS.tokenPrices, chainId, tokenAddresses[chainId]],
        queryFn: async () => {
          const tokenPrices = await getTokenPrices(chainId, tokenAddresses[chainId])
          return { chainId, tokenPrices }
        },
        staleTime: Infinity,
        enabled,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)
    const refetch = () => results?.forEach((result) => result.refetch())

    const formattedData: { [chainId: number]: { [address: Address]: number } } = {}
    results.forEach((result) => {
      if (result.data) {
        formattedData[result.data.chainId] = result.data.tokenPrices
      }
    })

    return { isFetched, refetch, data: formattedData }
  }, [results])
}
