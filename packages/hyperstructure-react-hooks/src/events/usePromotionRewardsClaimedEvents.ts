import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getPromotionRewardsClaimedEvents } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { QUERY_KEYS } from '../constants'

/**
 * Returns `RewardsClaimed` events
 * @param chainId the chain ID to query for promotion events in
 * @param options optional settings
 * @returns
 */
export const usePromotionRewardsClaimedEvents = (
  chainId: number,
  options?: {
    promotionIds?: bigint[]
    userAddresses?: Address[]
    fromBlock?: bigint
    toBlock?: bigint
  }
) => {
  const publicClient = usePublicClient({ chainId })

  const queryKey = [
    QUERY_KEYS.promotionRewardsClaimedEvents,
    chainId,
    options?.promotionIds?.map(String),
    options?.userAddresses,
    options?.fromBlock?.toString(),
    options?.toBlock?.toString() ?? 'latest'
  ]

  return useQuery(
    queryKey,
    async () => await getPromotionRewardsClaimedEvents(publicClient, options),
    {
      enabled: !!chainId && !!publicClient,
      ...NO_REFETCH
    }
  )
}
