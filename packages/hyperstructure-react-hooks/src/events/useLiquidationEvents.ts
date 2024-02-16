import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getLiquidationEvents } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { QUERY_KEYS } from '../constants'

/**
 * Returns `SwappedExactAmountOut` events
 * @param chainId the chain ID the liquidations occur in
 * @param options optional settings
 * @returns
 */
export const useLiquidationEvents = (
  chainId: number,
  options?: { fromBlock?: bigint; toBlock?: bigint }
) => {
  const publicClient = usePublicClient({ chainId })

  const queryKey = [
    QUERY_KEYS.liquidationEvents,
    chainId,
    options?.fromBlock?.toString(),
    options?.toBlock?.toString() ?? 'latest'
  ]

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!!publicClient) {
        return await getLiquidationEvents(publicClient, options)
      }
    },
    enabled: !!chainId && !!publicClient,
    ...NO_REFETCH
  })
}
