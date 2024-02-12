import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getRngL2RelayMsgEvents } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { QUERY_KEYS } from '../constants'

/**
 * Returns `MessageIdExecuted` events
 * @param chainId the chain ID the rng relay message is received in (L2)
 * @param options optional settings
 * @returns
 */
export const useRngL2RelayMsgEvents = (
  chainId: number,
  options?: { fromBlock?: bigint; toBlock?: bigint }
) => {
  const publicClient = usePublicClient({ chainId })

  const queryKey = [
    QUERY_KEYS.rngL2RelayMsgEvents,
    chainId,
    options?.fromBlock?.toString(),
    options?.toBlock?.toString() ?? 'latest'
  ]

  return useQuery(
    queryKey,
    async () => {
      if (!!publicClient) {
        return await getRngL2RelayMsgEvents(publicClient, options)
      }
    },
    {
      enabled: !!chainId && !!publicClient,
      ...NO_REFETCH
    }
  )
}
