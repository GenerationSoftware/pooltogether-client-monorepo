import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { GetBlockReturnType } from 'viem'
import { usePublicClient } from 'wagmi'

export const useBlocks = (
  chainId: number,
  blockNumbers: bigint[]
): { data: GetBlockReturnType[]; isFetched: boolean } => {
  const publicClient = usePublicClient({ chainId })

  const getQueryKey = (blockNumber: bigint) => ['block', chainId, blockNumber.toString()]

  const results = useQueries({
    queries: blockNumbers.map((blockNumber) => {
      return {
        queryKey: getQueryKey(blockNumber),
        queryFn: async () => await publicClient.getBlock({ blockNumber }),
        enabled: !!chainId && !!publicClient && !!blockNumber,
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
