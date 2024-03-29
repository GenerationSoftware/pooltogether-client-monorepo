import { getPromotions, Vault } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { PartialPromotionInfo } from '@shared/types'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { QUERY_KEYS } from '../constants'
import { usePromotionCreatedEvents } from '../events/usePromotionCreatedEvents'

/**
 * Returns TWAB rewards promotions for a vault
 * @param vault instance of the `Vault` class
 * @param options optional settings
 * @returns
 */
export const useVaultPromotions = (
  vault: Vault,
  options?: {
    tokenAddresses?: Address[]
    fromBlock?: bigint
    toBlock?: bigint
    twabRewardsAddress?: Address
  }
) => {
  const { data: promotionCreatedEvents, isFetched: isFetchedPromotionCreatedEvents } =
    usePromotionCreatedEvents(vault?.chainId, {
      vaultAddresses: [vault?.address],
      ...options
    })
  const promotionIds = !!promotionCreatedEvents
    ? promotionCreatedEvents.map((e) => e.args.promotionId)
    : []

  const queryKey = [
    QUERY_KEYS.promotionInfo,
    vault?.chainId,
    promotionIds.map(String),
    options?.twabRewardsAddress
  ]

  return useQuery({
    queryKey,
    queryFn: async () => {
      const promotions: { [id: string]: PartialPromotionInfo } = {}

      const allPromotionInfo = await getPromotions(vault.publicClient, promotionIds, {
        twabRewardsAddress: options?.twabRewardsAddress
      })

      promotionCreatedEvents?.forEach((promotionCreatedEvent) => {
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
    enabled: !!vault && isFetchedPromotionCreatedEvents,
    ...NO_REFETCH
  })
}
