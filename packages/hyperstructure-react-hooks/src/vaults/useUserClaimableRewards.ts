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
 * @param options optional settings
 * @returns
 */
export const useUserClaimableRewards = (
  chainId: number,
  userAddress: Address,
  promotions: {
    [id: string]: { startTimestamp?: bigint; numberOfEpochs?: number; epochDuration?: number }
  },
  options?: { twabRewardsAddress?: Address }
) => {
  const queryClient = useQueryClient()

  const publicClient = usePublicClient({ chainId })

  const promotionIds = !!promotions ? Object.keys(promotions) : []
  const getQueryKey = (val: (string | number)[]) => [
    QUERY_KEYS.userClaimableRewards,
    chainId,
    userAddress,
    val,
    options?.twabRewardsAddress
  ]

  return useQuery({
    queryKey: getQueryKey(promotionIds),
    queryFn: async () => {
      if (!!publicClient) {
        const claimableRewards = await getClaimableRewards(publicClient, userAddress, promotions, {
          twabRewardsAddress: options?.twabRewardsAddress
        })

        populateCachePerId(queryClient, getQueryKey, claimableRewards)

        return claimableRewards
      }
    },
    enabled: !!chainId && !!publicClient && !!userAddress && !!promotions,
    ...NO_REFETCH
  })
}
