import { getTokenAllowances } from '@pooltogether/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { isAddress } from 'viem'
import { usePublicClient } from 'wagmi'
import { populateCachePerId } from '..'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a dictionary keyed by the token addresses with allowances to a specific
 * contract for each token
 *
 * Stores queried allowances in cache
 * @param chainId chain ID
 * @param address address that issues the allowance
 * @param spenderAddress wallet address that spends the allowance
 * @param tokenAddresses token addresses to query allowances for
 * @param refetchInterval optional automatic refetching interval in ms
 * @returns
 */
export const useTokenAllowances = (
  chainId: number,
  address: `0x${string}`,
  spenderAddress: `0x${string}`,
  tokenAddresses: `0x${string}`[],
  refetchInterval?: number
): UseQueryResult<{ [tokenAddress: `0x${string}`]: bigint }, unknown> => {
  const queryClient = useQueryClient()

  const publicClient = usePublicClient({ chainId })

  const enabled =
    !!chainId &&
    !!address &&
    !!spenderAddress &&
    tokenAddresses.every((tokenAddress) => !!tokenAddress && isAddress(tokenAddress)) &&
    Array.isArray(tokenAddresses) &&
    tokenAddresses.length > 0 &&
    !!publicClient

  const getQueryKey = (val: (string | number)[]) => [
    QUERY_KEYS.tokenAllowances,
    chainId,
    address,
    spenderAddress,
    val
  ]

  return useQuery(
    getQueryKey(tokenAddresses),
    async () => await getTokenAllowances(publicClient, address, spenderAddress, tokenAddresses),
    {
      enabled,
      ...NO_REFETCH,
      refetchInterval: refetchInterval ?? false,
      onSuccess: (data) => populateCachePerId(queryClient, getQueryKey, data)
    }
  )
}

/**
 * Returns a token's allowance for a given address and spender contract
 *
 * Wraps {@link useTokenAllowances}
 * @param chainId chain ID
 * @param address address that issues the allowance
 * @param spenderAddress wallet address that spends the allowance
 * @param tokenAddress token address to query allowance for
 * @param refetchInterval optional automatic refetching interval in ms
 * @returns
 */
export const useTokenAllowance = (
  chainId: number,
  address: `0x${string}`,
  spenderAddress: `0x${string}`,
  tokenAddress: `0x${string}`,
  refetchInterval?: number
): { data?: bigint } & Omit<UseQueryResult<{ [tokenAddress: `0x${string}`]: bigint }>, 'data'> => {
  const result = useTokenAllowances(
    chainId,
    address,
    spenderAddress,
    [tokenAddress],
    refetchInterval
  )
  return { ...result, data: result.data?.[tokenAddress] }
}
