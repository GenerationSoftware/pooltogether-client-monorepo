import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getRngAuctionEvents } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { QUERY_KEYS } from '../constants'

/**
 * Returns `RngAuctionCompleted` events
 * @param chainId the chain ID the RNG auction occurs in
 * @param options optional settings
 * @returns
 */
export const useRngAuctionEvents = (
  chainId: number,
  options?: { fromBlock?: bigint; toBlock?: bigint }
) => {
  const publicClient = usePublicClient({ chainId })

  const queryKey = [
    QUERY_KEYS.rngAuctionEvents,
    chainId,
    options?.fromBlock?.toString(),
    options?.toBlock?.toString() ?? 'latest'
  ]

  return useQuery(queryKey, async () => await getRngAuctionEvents(publicClient, options), {
    enabled: !!chainId && !!publicClient,
    ...NO_REFETCH
  })
}
