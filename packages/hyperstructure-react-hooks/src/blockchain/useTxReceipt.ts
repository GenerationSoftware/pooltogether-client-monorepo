import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { GetTransactionReceiptReturnType } from 'viem'
import { usePublicClient } from 'wagmi'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a transaction receipt
 * @param chainId the chain ID the transaction was made in
 * @param hash the transaction's hash
 * @returns
 */
export const useTxReceipt = (
  chainId: number,
  hash: `0x${string}`
): UseQueryResult<GetTransactionReceiptReturnType> => {
  const publicClient = usePublicClient({ chainId })

  const queryKey = [QUERY_KEYS.txReceipt, chainId, hash]

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!!publicClient) {
        return await publicClient.getTransactionReceipt({ hash })
      }
    },
    enabled: !!chainId && !!publicClient && !!hash,
    ...NO_REFETCH
  })
}
