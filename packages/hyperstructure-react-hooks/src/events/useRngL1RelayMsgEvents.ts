import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getRngL1RelayMsgEvents } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { QUERY_KEYS } from '../constants'

/**
 * Returns `RelayedToDispatcher` events
 * @param chainId the chain ID the rng relay message is dispatched from (L1)
 * @param options optional settings
 * @returns
 */
export const useRngL1RelayMsgEvents = (
  chainId: number,
  options?: { fromBlock?: bigint; toBlock?: bigint }
) => {
  const publicClient = usePublicClient({ chainId })

  const queryKey = [
    QUERY_KEYS.rngL1RelayMsgEvents,
    chainId,
    options?.fromBlock?.toString(),
    options?.toBlock?.toString() ?? 'latest'
  ]

  return useQuery(queryKey, async () => await getRngL1RelayMsgEvents(publicClient, options), {
    enabled: !!chainId && !!publicClient,
    ...NO_REFETCH
  })
}
