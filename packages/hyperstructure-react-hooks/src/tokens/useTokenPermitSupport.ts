import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getTokenPermitSupport } from '@shared/utilities'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { QUERY_KEYS } from '../constants'
import { useTokenDomain } from './useTokenDomain'

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

  const { data: tokenDomain, isFetched: isFetchedTokenDomain } = useTokenDomain(
    chainId,
    tokenAddress
  )

  const enabled =
    !!chainId && !!tokenAddress && !!publicClient && isFetchedTokenDomain && !!tokenDomain

  const queryKey = [
    QUERY_KEYS.tokenPermitSupport,
    chainId,
    tokenAddress,
    tokenDomain?.name,
    tokenDomain?.version
  ]

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!!publicClient && !!tokenDomain) {
        return await getTokenPermitSupport(publicClient, tokenAddress, { domain: tokenDomain })
      }
    },
    enabled,
    ...NO_REFETCH
  })
}
