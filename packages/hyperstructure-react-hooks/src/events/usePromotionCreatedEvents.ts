import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getPromotionCreatedEvents } from '@shared/utilities'
import { useQueries, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { usePublicClientsByChain } from '../blockchain/useClients'
import { QUERY_KEYS } from '../constants'

/**
 * Returns `PromotionCreated` events
 * @param chainId the chain ID to query for promotion events in
 * @param options optional settings
 * @returns
 */
export const usePromotionCreatedEvents = (
  chainId: number,
  options?: {
    promotionIds?: bigint[]
    vaultAddresses?: Address[]
    tokenAddresses?: Address[]
    fromBlock?: bigint
    toBlock?: bigint
    twabRewardsAddress?: Address
  }
) => {
  const publicClient = usePublicClient({ chainId })

  const queryKey = [
    QUERY_KEYS.promotionCreatedEvents,
    chainId,
    options?.promotionIds?.map((id) => id.toString()),
    options?.vaultAddresses,
    options?.tokenAddresses,
    options?.fromBlock?.toString(),
    options?.toBlock?.toString() ?? 'latest',
    options?.twabRewardsAddress
  ]

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!!publicClient) {
        return await getPromotionCreatedEvents(publicClient, options)
      }
    },
    enabled: !!chainId && !!publicClient,
    ...NO_REFETCH
  })
}

/**
 * Returns `PromotionCreated` events across many chains
 * @param chainIds the chain IDs to query for promotion events in
 * @param options optional settings
 * @returns
 */
export const usePromotionCreatedEventsAcrossChains = (
  chainIds: number[],
  options?: {
    [chainId: number]: {
      promotionIds?: bigint[]
      vaultAddresses?: Address[]
      tokenAddresses?: Address[]
      fromBlock?: bigint
      toBlock?: bigint
      twabRewardsAddress?: Address
    }
  }
) => {
  const publicClients = usePublicClientsByChain({ useAll: true })

  const results = useQueries({
    queries: chainIds.map((chainId) => {
      const publicClient = publicClients[chainId]

      const queryKey = [
        QUERY_KEYS.promotionCreatedEvents,
        chainId,
        options?.[chainId]?.promotionIds?.map((id) => id.toString()),
        options?.[chainId]?.vaultAddresses,
        options?.[chainId]?.tokenAddresses,
        options?.[chainId]?.fromBlock?.toString(),
        options?.[chainId]?.toBlock?.toString() ?? 'latest',
        options?.[chainId]?.twabRewardsAddress
      ]

      return {
        queryKey,
        queryFn: async () => await getPromotionCreatedEvents(publicClient, options?.[chainId]),
        enabled: !!chainId && !!publicClient,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)
    const refetch = () => results?.forEach((result) => result.refetch())

    const data: { [chainId: number]: Awaited<ReturnType<typeof getPromotionCreatedEvents>> } = {}
    results.forEach((result, i) => {
      if (!!result.data) {
        data[chainIds[i]] = result.data
      }
    })

    return { isFetched, refetch, data }
  }, [results])
}
