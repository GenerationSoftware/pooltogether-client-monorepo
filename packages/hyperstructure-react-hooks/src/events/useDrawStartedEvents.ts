import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getDrawStartedEvents } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { QUERY_KEYS } from '../constants'

/**
 * Returns `DrawStarted` events
 * @param prizePool the prize pool to query events for
 * @param options optional settings
 * @returns
 */
export const useDrawStartedEvents = (
  prizePool: PrizePool,
  options?: { fromBlock?: bigint; toBlock?: bigint }
) => {
  const publicClient = usePublicClient({ chainId: prizePool?.chainId })

  const queryKey = [
    QUERY_KEYS.drawStartedEvents,
    prizePool?.id,
    options?.fromBlock?.toString(),
    options?.toBlock?.toString() ?? 'latest'
  ]

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!!publicClient) {
        const drawManagerAddress = await prizePool.getDrawManagerAddress()
        return await getDrawStartedEvents(publicClient, drawManagerAddress, options)
      }
    },
    enabled: !!prizePool && !!publicClient,
    ...NO_REFETCH
  })
}
