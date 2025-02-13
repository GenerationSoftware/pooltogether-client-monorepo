import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { PartialPoolWidePromotionInfo } from '@shared/types'
import {
  getPoolWidePromotions,
  getPoolWidePromotionVaultTokensPerEpoch,
  getVaultId,
  POOL_WIDE_TWAB_REWARDS_ADDRESSES
} from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { QUERY_KEYS } from '../constants'
import { usePoolWidePromotionCreatedEvents } from '../events/usePoolWidePromotionCreatedEvents'

/**
 * Returns pool-wide TWAB rewards promotions for a vault
 * @param vault instance of the `Vault` class
 * @param options optional settings
 * @returns
 */
export const usePoolWideVaultPromotions = (
  vault: Vault,
  options?: {
    tokenAddresses?: Address[]
    fromBlock?: bigint
    toBlock?: bigint
  }
) => {
  const {
    data: poolWidePromotionCreatedEvents,
    isFetched: isFetchedPoolWidePromotionCreatedEvents
  } = usePoolWidePromotionCreatedEvents(vault?.chainId, options)

  const poolWidePromotionIds = !!poolWidePromotionCreatedEvents
    ? poolWidePromotionCreatedEvents.map((e) => e.args.promotionId)
    : []

  const queryKey = [
    QUERY_KEYS.poolWidePromotionInfo,
    !!vault ? getVaultId(vault) : undefined,
    poolWidePromotionIds.map(String)
  ]

  return useQuery({
    queryKey,
    queryFn: async () => {
      const promotions: { [id: string]: PartialPoolWidePromotionInfo } = {}

      if (!!POOL_WIDE_TWAB_REWARDS_ADDRESSES[vault.chainId]) {
        const allPromotionInfo = await getPoolWidePromotions(
          vault.publicClient,
          poolWidePromotionIds
        )
        const allVaultTokensPerEpoch = await getPoolWidePromotionVaultTokensPerEpoch(
          vault.publicClient,
          vault.address,
          allPromotionInfo
        )

        poolWidePromotionCreatedEvents?.forEach((promotionCreatedEvent) => {
          const id = promotionCreatedEvent.args.promotionId.toString()

          promotions[id] = {
            startTimestamp: BigInt(promotionCreatedEvent.args.startTimestamp),
            vault: vault.address,
            epochDuration: promotionCreatedEvent.args.epochDuration,
            createdAtBlockNumber: promotionCreatedEvent.blockNumber,
            token: promotionCreatedEvent.args.token,
            tokensPerEpoch: promotionCreatedEvent.args.tokensPerEpoch,
            vaultTokensPerEpoch: allVaultTokensPerEpoch[id],
            ...allPromotionInfo[id]
          }
        })
      }

      return promotions
    },
    enabled: !!vault && isFetchedPoolWidePromotionCreatedEvents,
    ...NO_REFETCH
  })
}
