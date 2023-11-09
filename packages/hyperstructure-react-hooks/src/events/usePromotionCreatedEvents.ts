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
    vaultAddresses?: Address[]
    tokenAddresses?: Address[]
    fromBlock?: bigint
    toBlock?: bigint
  }
) => {
  const publicClient = usePublicClient({ chainId })

  const queryKey = [
    QUERY_KEYS.promotionCreatedEvents,
    chainId,
    options?.vaultAddresses,
    options?.tokenAddresses,
    options?.fromBlock?.toString(),
    options?.toBlock?.toString() ?? 'latest'
  ]

  return useQuery(queryKey, async () => await getPromotionCreatedEvents(publicClient, options), {
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
      vaultAddresses?: Address[]
      tokenAddresses?: Address[]
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
        QUERY_KEYS.promotionCreatedEvents,
        chainId,
        options?.[chainId]?.vaultAddresses,
        options?.[chainId]?.tokenAddresses,
        options?.[chainId]?.fromBlock?.toString(),
        options?.[chainId]?.toBlock?.toString() ?? 'latest'
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

    const data: { [chainId: number]: Awaited<ReturnType<typeof getPromotionCreatedEvents>> } =
      Object.assign({}, ...results.map((result) => result.data))

    return { isFetched, refetch, data }
  }, [results])
}
