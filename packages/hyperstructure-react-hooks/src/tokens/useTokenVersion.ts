import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getTokenVersion } from '@shared/utilities'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a token's version (usually for signature purposes)
 * @param chainId chain ID
 * @param tokenAddress token address to check version for
 * @returns
 */
export const useTokenVersion = (
  chainId: number,
  tokenAddress: Address
): UseQueryResult<string, unknown> => {
  const publicClient = usePublicClient({ chainId })

  const enabled = !!chainId && !!tokenAddress && !!publicClient

  const queryKey = [QUERY_KEYS.tokenVersions, chainId, tokenAddress]

  return useQuery(queryKey, async () => await getTokenVersion(publicClient, tokenAddress), {
    enabled,
    ...NO_REFETCH
  })
}
