import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getRelayAuctionEvents } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { QUERY_KEYS } from '../constants'

/**
 * Returns `AuctionRewardAllocated` events
 * @param chainId the chain ID the relay auction occurs in (L2)
 * @param options optional settings
 * @returns
 */
export const useRelayAuctionEvents = (
  chainId: number,
  options?: { fromBlock?: bigint; toBlock?: bigint }
) => {
  const publicClient = usePublicClient({ chainId })

  const queryKey = [
    QUERY_KEYS.relayAuctionEvents,
    chainId,
    options?.fromBlock?.toString(),
    options?.toBlock?.toString() ?? 'latest'
  ]

  return useQuery(
    queryKey,
    async () => {
      if (!!publicClient) {
        return await getRelayAuctionEvents(publicClient, options)
      }
    },
    {
      enabled: !!chainId && !!publicClient,
      ...NO_REFETCH
    }
  )
}
