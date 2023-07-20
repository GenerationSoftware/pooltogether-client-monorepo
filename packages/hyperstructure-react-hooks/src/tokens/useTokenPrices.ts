import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getTokenPrices } from '@shared/utilities'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Address } from 'viem'
import { QUERY_KEYS } from '../constants'

/**
 * Returns token prices in ETH
 * @param chainId chain ID the tokens are in
 * @param tokenAddresses token addresses to query prices for
 * @returns
 */
export const useTokenPrices = (
  chainId: number,
  tokenAddresses: string[]
): UseQueryResult<{ [address: Address]: number }, unknown> => {
  const enabled = !!chainId && !!tokenAddresses && tokenAddresses.length > 0

  return useQuery(
    [QUERY_KEYS.tokenPrices, chainId, tokenAddresses],
    async () => await getTokenPrices(chainId, tokenAddresses),
    {
      staleTime: Infinity,
      enabled,
      ...NO_REFETCH
    }
  )
}
