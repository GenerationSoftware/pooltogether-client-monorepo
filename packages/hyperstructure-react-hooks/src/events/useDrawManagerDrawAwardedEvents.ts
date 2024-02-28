import {
  getDrawManagerDrawAwardedEvents,
  PrizePool
} from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { QUERY_KEYS } from '../constants'

/**
 * Returns `DrawAwarded` events from a prize pool's draw manager
 * @param prizePool the prize pool to query events for
 * @param options optional settings
 * @returns
 */
export const useDrawManagerDrawAwardedEvents = (
  prizePool: PrizePool,
  options?: { fromBlock?: bigint; toBlock?: bigint }
) => {
  const publicClient = usePublicClient({ chainId: prizePool?.chainId })

  const queryKey = [
    QUERY_KEYS.drawManagerDrawAwardedEvents,
    prizePool?.id,
    options?.fromBlock?.toString(),
    options?.toBlock?.toString() ?? 'latest'
  ]

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!!publicClient) {
        const drawManagerAddress = await prizePool.getDrawManagerAddress()
        return await getDrawManagerDrawAwardedEvents(publicClient, drawManagerAddress, options)
      }
    },
    enabled: !!prizePool && !!publicClient,
    ...NO_REFETCH
  })
}
