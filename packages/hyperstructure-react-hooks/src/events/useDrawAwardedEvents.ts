import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getDrawAwardedEvents } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { QUERY_KEYS } from '../constants'

/**
 * Returns `DrawAwarded` events
 * @param prizePool the prize pool to query events for
 * @param options optional settings
 * @returns
 */
export const useDrawAwardedEvents = (
  prizePool: PrizePool,
  options?: { fromBlock?: bigint; toBlock?: bigint }
) => {
  const publicClient = usePublicClient({ chainId: prizePool?.chainId })

  const queryKey = [
    QUERY_KEYS.drawAwardedEvents,
    prizePool?.id,
    options?.fromBlock?.toString(),
    options?.toBlock?.toString() ?? 'latest'
  ]

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!!publicClient) {
        return await getDrawAwardedEvents(publicClient, prizePool.address, options)
      }
    },
    enabled: !!prizePool && !!publicClient,
    ...NO_REFETCH
  })
}
