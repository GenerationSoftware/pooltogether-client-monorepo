import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { GetBlockReturnType } from 'viem'
import { usePublicClient } from 'wagmi'
import { QUERY_KEYS } from '../constants'

/**
 * Returns many blocks
 * @param chainId the chain ID to query for blocks in
 * @param blockNumbers an array of block #s to query for
 * @returns
 */
export const useBlocks = (
  chainId: number,
  blockNumbers: bigint[]
): { data: GetBlockReturnType[]; isFetched: boolean } => {
  const publicClient = usePublicClient({ chainId })

  const getQueryKey = (blockNumber: bigint) => [QUERY_KEYS.block, chainId, blockNumber.toString()]

  const results = useQueries({
    queries: blockNumbers.map((blockNumber) => {
      return {
        queryKey: getQueryKey(blockNumber),
        queryFn: async () => await publicClient.getBlock({ blockNumber }),
        enabled: !!chainId && !!blockNumber && !!publicClient,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)

    const data = results
      .filter((result) => !!result.data)
      .map((result) => result.data) as GetBlockReturnType[]

    return { isFetched, data }
  }, [results])
}
