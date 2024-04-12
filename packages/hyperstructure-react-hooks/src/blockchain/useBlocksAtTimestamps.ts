import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getBlockAtTimestamp } from '@shared/utilities'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Chain, GetBlockReturnType } from 'viem'
import { usePublicClient } from 'wagmi'
import { QUERY_KEYS } from '../constants'

/**
 * Returns many blocks close to each provided timestamp
 * @param chainId chain ID to query for blocks in
 * @param timestamps an array of timestamps to query blocks for
 * @returns
 */
export const useBlocksAtTimestamps = (chainId: number, timestamps: number[]) => {
  const publicClient = usePublicClient({ chainId })

  const getQueryKey = (timestamp: number) => [
    QUERY_KEYS.blockAtTimestamp,
    chainId,
    Math.floor(timestamp)
  ]

  const results = useQueries({
    queries: timestamps.map((timestamp) => {
      return {
        queryKey: getQueryKey(timestamp),
        queryFn: async () => {
          if (!!publicClient) {
            return await getBlockAtTimestamp(publicClient, BigInt(Math.floor(timestamp)))
          }
        },
        enabled: !!chainId && !!timestamp && !!publicClient,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)

    const data: { [timestamp: number]: GetBlockReturnType<Chain, false> } = {}
    results.forEach((result, i) => {
      if (!!result.data) {
        data[timestamps[i]] = result.data
      }
    })

    return { isFetched, data }
  }, [results])
}
