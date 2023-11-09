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
    vault?.id,
    options?.tokenAddresses,
    options?.fromBlock?.toString(),
    options?.toBlock?.toString() ?? 'latest'
  ]

  return useQuery(
    queryKey,
    async () => {
      const promotions: { [id: string]: PartialPromotionInfo } = {}

      const allPromotionInfo = await getPromotions(vault.publicClient, promotionIds)

      promotionCreatedEvents?.forEach((promotionCreatedEvent) => {
        const id = promotionCreatedEvent.args.promotionId.toString()
        const vault = promotionCreatedEvent.args.vault
        const token = promotionCreatedEvent.args.token
        const createdAtBlockNumber = promotionCreatedEvent.blockNumber
        promotions[id] = { vault, token, createdAtBlockNumber, ...allPromotionInfo[id] }
      })

      return promotions
    },
    {
      enabled: !!vault && isFetchedPromotionCreatedEvents,
      ...NO_REFETCH
    }
  )
}
