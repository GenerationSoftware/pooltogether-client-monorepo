import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { PublicClient, WalletClient } from 'viem'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a client's chain ID
 * @param client a Viem client to get the chain ID from
 * @returns
 */
export const useClientChainId = (client: PublicClient | WalletClient): UseQueryResult<number> => {
  const queryKey = [QUERY_KEYS.clientChainId, client.key]

  return useQuery({
    queryKey,
    queryFn: async () => await client.getChainId(),
    ...NO_REFETCH
  })
}
