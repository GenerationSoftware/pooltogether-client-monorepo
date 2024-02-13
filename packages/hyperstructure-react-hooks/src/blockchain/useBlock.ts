import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { GetBlockParameters, GetBlockReturnType } from 'viem'
import { usePublicClient } from 'wagmi'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a block
 * @param chainId the chain ID to query for block in
 * @param blockNumber block # to query for (or "latest")
 * @returns
 */
export const useBlock = (
  chainId: number,
  blockNumber: bigint | 'latest'
): UseQueryResult<GetBlockReturnType, unknown> => {
  const publicClient = usePublicClient({ chainId })

  const queryKey = [QUERY_KEYS.block, chainId, blockNumber?.toString() ?? 'latest']

  return useQuery(
    queryKey,
    async () => {
      if (!!publicClient) {
        const args: GetBlockParameters =
          blockNumber === 'latest' ? { blockTag: 'latest' } : { blockNumber }
        return await publicClient.getBlock(args)
      }
    },
    {
      enabled: !!chainId && !!blockNumber && !!publicClient,
      ...NO_REFETCH
    }
  )
}
