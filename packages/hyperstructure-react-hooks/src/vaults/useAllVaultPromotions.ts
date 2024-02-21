import { Vaults } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { PartialPromotionInfo } from '@shared/types'
import { getPromotions } from '@shared/utilities'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address } from 'viem'
import { usePublicClientsByChain } from '../blockchain/useClients'
import { QUERY_KEYS } from '../constants'
import { usePromotionCreatedEventsAcrossChains } from '../events/usePromotionCreatedEvents'

/**
 * Returns TWAB rewards promotions for each vault
 * @param vaults instance of the `Vaults` class
 * @param options optional settings
 * @returns
 */
export const useAllVaultPromotions = (
  vaults: Vaults,
  options?: {
    [chainId: number]: {
      tokenAddresses?: Address[]
      fromBlock?: bigint
      toBlock?: bigint
    }
  }
) => {
  const publicClients = usePublicClientsByChain({ useAll: true })

  const fullOptions = useMemo(() => {
    if (!!vaults && !!options) {
      const newOptions: {
        [chainId: number]: {
          vaultAddresses?: Address[]
          tokenAddresses?: Address[]
          fromBlock?: bigint
          toBlock?: bigint
        }
      } = {}

      vaults.chainIds.forEach((chainId) => {
        newOptions[chainId] = {
          vaultAddresses: vaults.vaultAddresses[chainId],
          ...options[chainId]
        }
      })

      return newOptions
    }
  }, [vaults, options])

  const { data: promotionCreatedEvents, isFetched: isFetchedPromotionCreatedEvents } =
    usePromotionCreatedEventsAcrossChains(vaults.chainIds, fullOptions)

  const results = useQueries({
    queries: vaults.chainIds.map((chainId) => {
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
    const isFetching = results?.some((result) => result.isFetching)
    const refetch = () => results?.forEach((result) => result.refetch())

    const data: { [chainId: number]: { [id: string]: PartialPromotionInfo } } = {}
    results.forEach((result, i) => {
      if (!!result.data) {
        data[vaults.chainIds[i]] = result.data
      }
    })

    return { isFetched, isFetching, refetch, data }
  }, [results])
}
