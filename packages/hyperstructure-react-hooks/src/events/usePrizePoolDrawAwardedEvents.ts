import {
  getPrizePoolDrawAwardedEvents,
  PrizePool
} from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { QUERY_KEYS } from '../constants'

/**
 * Returns `DrawAwarded` events from a prize pool
 * @param prizePool the prize pool to query events for
 * @param options optional settings
 * @returns
 */
export const usePrizePoolDrawAwardedEvents = (
  prizePool: PrizePool,
  options?: { fromBlock?: bigint; toBlock?: bigint }
) => {
  const publicClient = usePublicClient({ chainId: prizePool?.chainId })

  const queryKey = [
    QUERY_KEYS.prizePoolDrawAwardedEvents,
    prizePool?.id,
    options?.fromBlock?.toString(),
    options?.toBlock?.toString() ?? 'latest'
  ]

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!!publicClient) {
        return await getPrizePoolDrawAwardedEvents(publicClient, prizePool.address, options)
      }
    },
    enabled: !!prizePool && !!publicClient,
    ...NO_REFETCH
  })
}
