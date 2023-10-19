import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getTokenTransferEvents } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { QUERY_KEYS } from '../constants'

/**
 * Returns `Transfer` events for a given token
 * @param chainId chain ID the token is in
 * @param tokenAddress the token's address
 * @param options optional settings
 * @returns
 */
export const useTransferEvents = (
  chainId: number,
  tokenAddress: Address,
  options?: { from?: Address[]; to?: Address[]; fromBlock?: bigint; toBlock?: bigint }
) => {
  const publicClient = usePublicClient({ chainId })

  const queryKey = [
    QUERY_KEYS.tokenTransferEvents,
    chainId,
    tokenAddress,
    options?.from,
    options?.to,
    options?.fromBlock?.toString(),
    options?.toBlock?.toString() ?? 'latest'
  ]

  return useQuery(
    queryKey,
    async () => await getTokenTransferEvents(publicClient, tokenAddress, options),
    {
      enabled: !!chainId && !!publicClient && !!tokenAddress,
      ...NO_REFETCH
    }
  )
}
