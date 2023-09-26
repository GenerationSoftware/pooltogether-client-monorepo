import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { GetBlockParameters, GetBlockReturnType } from 'viem'
import { usePublicClient } from 'wagmi'

export const useBlock = (
  chainId: number,
  blockNumber?: bigint | 'latest'
): UseQueryResult<GetBlockReturnType, unknown> => {
  const publicClient = usePublicClient({ chainId })

  const queryKey = ['block', chainId, blockNumber?.toString() ?? 'latest']

  return useQuery(
    queryKey,
    async () => {
      const args: GetBlockParameters =
        blockNumber === 'latest' ? { blockTag: 'latest' } : { blockNumber }
      const block = await publicClient.getBlock(args)
      return block
    },
    {
      enabled: !!chainId && !!publicClient && !!blockNumber,
      ...NO_REFETCH
    }
  )
}
