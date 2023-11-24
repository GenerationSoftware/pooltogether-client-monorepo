import {
  QUERY_KEYS,
  usePromotionCreatedEventsAcrossChains,
  usePublicClientsByChain
} from '@generationsoftware/hyperstructure-react-hooks'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { PartialPromotionInfo } from '@shared/types'
import { getPromotions } from '@shared/utilities'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { PROMOTION_FILTERS, SUPPORTED_NETWORKS } from '@constants/config'

/**
 * Returns all TWAB rewards promotions for the given chain IDs
 * @returns
 */
export const useAllVaultPromotions = () => {
  const publicClients = usePublicClientsByChain({ useAll: true })

  const chainIds = SUPPORTED_NETWORKS.map(Number)

  const { data: promotionCreatedEvents, isFetched: isFetchedPromotionCreatedEvents } =
    usePromotionCreatedEventsAcrossChains(chainIds, PROMOTION_FILTERS)

  const results = useQueries({
    queries: chainIds.map((chainId) => {
      const publicClient = publicClients[chainId]

      const promotionIds = promotionCreatedEvents[chainId]?.map((e) => e.args.promotionId) ?? []

      const queryKey = [QUERY_KEYS.promotionInfo, chainId, promotionIds.map(String)]

      return {
        queryKey,
        queryFn: async () => {
          const promotions: { [id: string]: PartialPromotionInfo } = {}

          const allPromotionInfo = await getPromotions(publicClient, promotionIds)

          promotionCreatedEvents?.[chainId]?.forEach((promotionCreatedEvent) => {
            const id = promotionCreatedEvent.args.promotionId.toString()
            promotions[id] = {
              startTimestamp: promotionCreatedEvent.args.startTimestamp,
              vault: promotionCreatedEvent.args.vault,
              epochDuration: promotionCreatedEvent.args.epochDuration,
              createdAtBlockNumber: promotionCreatedEvent.blockNumber,
              token: promotionCreatedEvent.args.token,
              tokensPerEpoch: promotionCreatedEvent.args.tokensPerEpoch,
              ...allPromotionInfo[id]
            }
          })

          return promotions
        },
        enabled: !!chainId && !!publicClient && isFetchedPromotionCreatedEvents,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)
    const refetch = () => results?.forEach((result) => result.refetch())

    const data: { [chainId: number]: { [id: string]: PartialPromotionInfo } } = {}
    results.forEach((result, i) => {
      if (!!result.data) {
        data[chainIds[i]] = result.data
      }
    })

    return { isFetched, refetch, data }
  }, [results])
}
