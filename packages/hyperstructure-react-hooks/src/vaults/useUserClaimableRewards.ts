import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getClaimableRewards } from '@shared/utilities'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { QUERY_KEYS } from '../constants'
import { populateCachePerId } from '../utils/populateCachePerId'

/**
 * Returns a user's claimable rewards for the given promotions
 * @param chainId network to query rewards in
 * @param userAddress user address to get delegate for
 * @param promotions info for the promotions to consider
 * @returns
 */
export const useUserClaimableRewards = (
  chainId: number,
  userAddress: Address,
  promotions: {
    [id: string]: { startTimestamp?: bigint; numberOfEpochs?: number; epochDuration?: number }
  }
) => {
  const queryClient = useQueryClient()

  const publicClient = usePublicClient({ chainId })

  const promotionIds = !!promotions ? Object.keys(promotions) : []
  const getQueryKey = (val: (string | number)[]) => [
    QUERY_KEYS.userClaimableRewards,
    chainId,
    userAddress,
    val
  ]

  return useQuery(
    getQueryKey(promotionIds),
    async () => await getClaimableRewards(publicClient, userAddress, promotions),
    {
      enabled: !!chainId && !!publicClient && !!userAddress && !!promotions,
      ...NO_REFETCH,
      onSuccess: (data) => populateCachePerId(queryClient, getQueryKey, data)
    }
  )
}
