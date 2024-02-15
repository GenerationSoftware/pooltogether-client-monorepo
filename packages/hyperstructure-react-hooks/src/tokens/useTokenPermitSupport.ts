import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getTokenPermitSupport } from '@shared/utilities'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { QUERY_KEYS } from '../constants'

/**
 * Returns the type of permit a token supports
 * @param chainId chain ID
 * @param tokenAddress token address to check permit support for
 * @returns
 */
export const useTokenPermitSupport = (
  chainId: number,
  tokenAddress: Address
): UseQueryResult<Awaited<ReturnType<typeof getTokenPermitSupport>>> => {
  const publicClient = usePublicClient({ chainId })

  const enabled = !!chainId && !!tokenAddress && !!publicClient

  const queryKey = [QUERY_KEYS.tokenPermitSupport, chainId, tokenAddress]

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!!publicClient) {
        return await getTokenPermitSupport(publicClient, tokenAddress)
      }
    },
    enabled,
    ...NO_REFETCH
  })
}
