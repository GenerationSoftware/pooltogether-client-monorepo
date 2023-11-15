import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getPromotionRewardsClaimedEvents } from '@shared/utilities'
import { useQueries, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { usePublicClientsByChain } from '../blockchain/useClients'
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

/**
 * Returns `RewardsClaimed` events across many chains
 * @param chainIds the chain IDs to query for promotion events in
 * @param options optional settings
 * @returns
 */
export const usePromotionRewardsClaimedEventsAcrossChains = (
  chainIds: number[],
  options?: {
    [chainId: number]: {
      promotionIds?: bigint[]
      userAddresses?: Address[]
      fromBlock?: bigint
      toBlock?: bigint
    }
  }
) => {
  const publicClients = usePublicClientsByChain({ useAll: true })

  const results = useQueries({
    queries: chainIds.map((chainId) => {
      const publicClient = publicClients[chainId]

      const queryKey = [
        QUERY_KEYS.promotionRewardsClaimedEvents,
        chainId,
        options?.[chainId]?.promotionIds?.map(String),
        options?.[chainId]?.userAddresses,
        options?.[chainId]?.fromBlock?.toString(),
        options?.[chainId]?.toBlock?.toString() ?? 'latest'
      ]

      return {
        queryKey,
        queryFn: async () =>
          await getPromotionRewardsClaimedEvents(publicClient, options?.[chainId]),
        enabled: !!chainId && !!publicClient,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)
    const refetch = () => results?.forEach((result) => result.refetch())

    const data: {
      [chainId: number]: Awaited<ReturnType<typeof getPromotionRewardsClaimedEvents>>
    } = {}
    results.forEach((result, i) => {
      if (!!result.data) {
        data[chainIds[i]] = result.data
      }
    })

    return { isFetched, refetch, data }
  }, [results])
}
