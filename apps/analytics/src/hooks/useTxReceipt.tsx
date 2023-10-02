import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { GetTransactionReceiptReturnType } from 'viem'
import { usePublicClient } from 'wagmi'

export const useTxReceipt = (
  chainId: number,
  hash: `0x${string}`
): UseQueryResult<GetTransactionReceiptReturnType, unknown> => {
  const publicClient = usePublicClient({ chainId })

  const queryKey = ['txReceipt', chainId, hash]

  return useQuery(queryKey, async () => await publicClient.getTransactionReceipt({ hash }), {
    enabled: !!chainId && !!publicClient && !!hash,
    ...NO_REFETCH
  })
}
