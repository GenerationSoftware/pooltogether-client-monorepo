import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getBlockAtTimestamp } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a block close to the provided timestamp
 * @param chainId chain ID to query for a block in
 * @param timestamp timestamp to query block for
 * @returns
 */
export const useBlockAtTimestamp = (chainId: number, timestamp: number) => {
  const publicClient = usePublicClient({ chainId })

  const queryKey = [QUERY_KEYS.blockAtTimestamp, chainId, Math.floor(timestamp)]

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!!publicClient) {
        return await getBlockAtTimestamp(publicClient, BigInt(Math.floor(timestamp)))
      }
    },
    enabled: !!chainId && !!timestamp && !!publicClient,
    ...NO_REFETCH
  })
}
