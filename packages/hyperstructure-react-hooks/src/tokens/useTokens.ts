import { getTokenInfo, TokenWithSupply } from '@pooltogether/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { isAddress } from 'viem'
import { usePublicClient } from 'wagmi'
import { populateCachePerId } from '..'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a dictionary keyed by the token addresses with basic token data
 *
 * Stores queried token data in cache
 * @param chainId chain ID
 * @param tokenAddresses token addresses to query info for
 * @returns
 */
export const useTokens = (
  chainId: number,
  tokenAddresses: `0x${string}`[]
): UseQueryResult<{ [tokenAddress: `0x${string}`]: TokenWithSupply }, unknown> => {
  const queryClient = useQueryClient()

  const publicClient = usePublicClient({ chainId })

  const enabled =
    !!chainId &&
    tokenAddresses.every((tokenAddress) => !!tokenAddress && isAddress(tokenAddress)) &&
    Array.isArray(tokenAddresses) &&
    tokenAddresses.length > 0 &&
    !!publicClient

  const getQueryKey = (val: (string | number)[]) => [QUERY_KEYS.tokens, chainId, val]

  return useQuery(
    getQueryKey(tokenAddresses),
    async () => await getTokenInfo(publicClient, tokenAddresses),
    {
      enabled,
      ...NO_REFETCH,
      onSuccess: (data) => populateCachePerId(queryClient, getQueryKey, data)
    }
  )
}

/**
 * Returns basic token data for one token
 *
 * Wraps {@link useTokens}
 * @param chainId chain ID
 * @param tokenAddress token address to query info for
 * @returns
 */
export const useToken = (
  chainId: number,
  tokenAddress: `0x${string}`
): { data?: TokenWithSupply } & Omit<
  UseQueryResult<{ [tokenAddress: `0x${string}`]: TokenWithSupply }>,
  'data'
> => {
  const result = useTokens(chainId, [tokenAddress])
  return { ...result, data: result.data?.[tokenAddress] }
}
