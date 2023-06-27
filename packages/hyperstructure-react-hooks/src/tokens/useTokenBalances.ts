import { getTokenBalances, TokenWithAmount } from '@pooltogether/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQueries, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { useMemo } from 'react'
import { isAddress, PublicClient } from 'viem'
import { usePublicClient } from 'wagmi'
import { populateCachePerId, usePublicClientsByChain } from '..'
import { QUERY_KEYS } from '../constants'

/**
 * Returns an address's token balances
 *
 * Stores queried balances in cache
 * @param chainId chain ID
 * @param address address to check for token balances
 * @param tokenAddresses token addresses to query balances for
 * @param refetchInterval optional automatic refetching interval in ms
 * @returns
 */
export const useTokenBalances = (
  chainId: number,
  address: `0x${string}`,
  tokenAddresses: `0x${string}`[],
  refetchInterval?: number
): UseQueryResult<{ [tokenAddress: `0x${string}`]: TokenWithAmount }, unknown> => {
  const queryClient = useQueryClient()

  const publicClient = usePublicClient({ chainId })

  const enabled =
    !!chainId &&
    !!address &&
    !!tokenAddresses &&
    tokenAddresses.every((tokenAddress) => !!tokenAddress && isAddress(tokenAddress)) &&
    Array.isArray(tokenAddresses) &&
    tokenAddresses.length > 0 &&
    !!publicClient

  const getQueryKey = (val: (string | number)[]) => [
    QUERY_KEYS.tokenBalances,
    chainId,
    address,
    val
  ]

  return useQuery(
    getQueryKey(tokenAddresses),
    async () => await getTokenBalances(publicClient, address, tokenAddresses),
    {
      enabled,
      ...NO_REFETCH,
      refetchInterval: refetchInterval ?? false,
      onSuccess: (data) => populateCachePerId(queryClient, getQueryKey, data)
    }
  )
}

/**
 * Returns an address's token balance
 *
 * Wraps {@link useTokenBalances}
 * @param chainId chain ID
 * @param address address to check for token balance
 * @param tokenAddress token address to query balance for
 * @param refetchInterval optional automatic refetching interval in ms
 * @returns
 */
export const useTokenBalance = (
  chainId: number,
  address: `0x${string}`,
  tokenAddress: `0x${string}`,
  refetchInterval?: number
): { data?: TokenWithAmount } & Omit<
  UseQueryResult<{ [tokenAddress: `0x${string}`]: TokenWithAmount }>,
  'data'
> => {
  const result = useTokenBalances(chainId, address, [tokenAddress], refetchInterval)
  return { ...result, data: result.data?.[tokenAddress] }
}

/**
 * Returns an address's token balance across many chains
 * @param chainIds chain IDs
 * @param address address to check for token balances
 * @param tokenAddresses token addresses for each chain to query balances for
 * @returns
 */
export const useTokenBalancesAcrossChains = (
  chainIds: number[],
  address: `0x${string}`,
  tokenAddresses: { [chainId: number]: `0x${string}`[] }
) => {
  const publicClients = usePublicClientsByChain()

  const filteredPublicClients: { [chainId: number]: PublicClient } = {}
  chainIds.forEach((chainId) => {
    if (!!publicClients[chainId]) {
      filteredPublicClients[chainId] = publicClients[chainId]
    }
  })

  const results = useQueries({
    queries: Object.keys(filteredPublicClients).map((strChainId) => {
      const chainId = parseInt(strChainId)
      const publicClient = filteredPublicClients[chainId]

      const chainTokenAddresses = !!chainId ? tokenAddresses?.[chainId] : []

      const enabled =
        !!chainId &&
        !!address &&
        !!chainTokenAddresses &&
        chainTokenAddresses.every((tokenAddress) => !!tokenAddress && isAddress(tokenAddress)) &&
        Array.isArray(chainTokenAddresses) &&
        chainTokenAddresses.length > 0 &&
        !!publicClient

      const queryKey = [QUERY_KEYS.tokenBalances, chainId, address, chainTokenAddresses]

      return {
        queryKey: queryKey,
        queryFn: async () => {
          const tokenBalances = await getTokenBalances(publicClient, address, chainTokenAddresses)
          return { chainId, tokenBalances }
        },
        enabled,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)
    const refetch = () => results?.forEach((result) => result.refetch())

    const formattedData: { [chainId: number]: { [tokenAddress: string]: TokenWithAmount } } = {}
    results.forEach((result) => {
      if (result.data && result.data.chainId) {
        formattedData[result.data.chainId] = result.data.tokenBalances
      }
    })
    return { isFetched, refetch, data: formattedData }
  }, [results])
}
