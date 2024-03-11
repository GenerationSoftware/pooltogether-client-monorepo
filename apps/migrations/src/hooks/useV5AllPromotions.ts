import { QUERY_KEYS, usePublicClientsByChain } from '@generationsoftware/hyperstructure-react-hooks'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { PartialPromotionInfo } from '@shared/types'
import { getPromotions } from '@shared/utilities'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useV5AllPromotionCreatedEvents } from './useV5AllPromotionCreatedEvents'

export const useV5AllPromotions = () => {
  const publicClients = usePublicClientsByChain({ useAll: true })

  const { data: allPromotionCreatedEvents } = useV5AllPromotionCreatedEvents()

  const allQueryData = useMemo(() => {
    const queries: {
      chainId: number
      twabRewardsAddress: Lowercase<Address>
      promotionIds: bigint[]
    }[] = []

    Object.entries(allPromotionCreatedEvents).forEach(([strChainId, contracts]) => {
      const chainId = parseInt(strChainId)

      Object.entries(contracts).forEach(([address, events]) => {
        const twabRewardsAddress = address as Lowercase<Address>
        const promotionIds = events.map((event) => event.args.promotionId)

        queries.push({ chainId, twabRewardsAddress, promotionIds })
      })
    })

    return queries
  }, [allPromotionCreatedEvents])

  const results = useQueries({
    queries: allQueryData.map(({ chainId, twabRewardsAddress, promotionIds }) => {
      const publicClient = publicClients[chainId]
      const promotionCreatedEvents = allPromotionCreatedEvents[chainId][twabRewardsAddress]

      const queryKey = [
        QUERY_KEYS.promotionInfo,
        chainId,
        promotionIds.map(String),
        twabRewardsAddress
      ]

      return {
        queryKey,
        queryFn: async () => {
          const promotions: { [id: string]: PartialPromotionInfo } = {}

          const allPromotionInfo = await getPromotions(publicClient, promotionIds, {
            twabRewardsAddress
          })

          promotionCreatedEvents.forEach((promotionCreatedEvent) => {
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
        enabled: !!chainId && !!publicClient && !!promotionCreatedEvents,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)
    const isFetching = results?.some((result) => result.isFetching)
    const refetch = () => results?.forEach((result) => result.refetch())

    const data: {
      [chainId: number]: {
        [twabRewardsAddress: Lowercase<Address>]: { [id: string]: PartialPromotionInfo }
      }
    } = {}
    results.forEach((result, i) => {
      if (!!result.data) {
        const { chainId, twabRewardsAddress } = allQueryData[i]

        if (data[chainId] === undefined) {
          data[chainId] = {}
        }

        data[chainId][twabRewardsAddress] = result.data
      }
    })

    return { isFetched, isFetching, refetch, data }
  }, [results])
}
