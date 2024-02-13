import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getTokenDomain } from '@shared/utilities'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Address, TypedDataDomain } from 'viem'
import { usePublicClient } from 'wagmi'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a token's EIP-712 domain
 * @param chainId chain ID
 * @param tokenAddress token to get domain for
 * @returns
 */
export const useTokenDomain = (
  chainId: number,
  tokenAddress: Address
): UseQueryResult<TypedDataDomain, unknown> => {
  const publicClient = usePublicClient({ chainId })

  const enabled = !!chainId && !!tokenAddress && !!publicClient

  const queryKey = [QUERY_KEYS.tokenDomain, chainId, tokenAddress]

  return useQuery(
    queryKey,
    async () => {
      if (!!publicClient) {
        return await getTokenDomain(publicClient, tokenAddress)
      }
    },
    {
      enabled,
      ...NO_REFETCH
    }
  )
}
