import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getTokenNonces } from '@shared/utilities'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { QUERY_KEYS } from '../constants'

/**
 * Returns an address's nonces for a given token
 * @param chainId chain ID
 * @param address address to check nonces for
 * @param tokenAddress token address to check nonces for
 * @param options optional settings
 * @returns
 */
export const useTokenNonces = (
  chainId: number,
  address: Address,
  tokenAddress: Address,
  options?: {
    refetchInterval?: number
    refetchOnWindowFocus?: boolean
  }
): UseQueryResult<bigint, unknown> => {
  const publicClient = usePublicClient({ chainId })

  const enabled = !!chainId && !!address && !!tokenAddress && !!publicClient

  const queryKey = [QUERY_KEYS.tokenNonces, chainId, address, tokenAddress]

  return useQuery(
    queryKey,
    async () => {
      if (!!publicClient) {
        return await getTokenNonces(publicClient, address, tokenAddress)
      }
    },
    {
      enabled,
      ...NO_REFETCH,
      refetchInterval: options?.refetchInterval ?? false,
      refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false
    }
  )
}
