import { Vaults } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { PartialPoolWidePromotionInfo } from '@shared/types'
import {
  getPoolWidePromotions,
  getPoolWidePromotionVaultTokensPerEpoch,
  POOL_WIDE_TWAB_REWARDS_ADDRESSES
} from '@shared/utilities'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address } from 'viem'
import { usePublicClientsByChain } from '../blockchain/useClients'
import { QUERY_KEYS } from '../constants'
import { usePoolWidePromotionCreatedEventsAcrossChains } from '../events/usePoolWidePromotionCreatedEvents'

/**
 * Returns pool-wide TWAB rewards promotions for each vault
 * @param vaults instance of the `Vaults` class
 * @param options optional settings
 * @returns
 */
export const useAllPoolWideVaultPromotions = (
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

  const {
    data: poolWidePromotionCreatedEvents,
    isFetched: isFetchedPoolWidePromotionCreatedEvents
  } = usePoolWidePromotionCreatedEventsAcrossChains(vaults.chainIds, fullOptions)

  const results = useQueries({
    queries: vaults.chainIds.map((chainId) => {
      const publicClient = publicClients[chainId]

      const poolWidePromotionIds =
        poolWidePromotionCreatedEvents[chainId]?.map((e) => e.args.promotionId) ?? []

      const queryKey = [QUERY_KEYS.poolWidePromotionInfo, chainId, poolWidePromotionIds.map(String)]

      return {
        queryKey,
        queryFn: async () => {
          const promotions: { [id: string]: PartialPoolWidePromotionInfo } = {}

          if (!!POOL_WIDE_TWAB_REWARDS_ADDRESSES[chainId]) {
            const allPromotionInfo = await getPoolWidePromotions(publicClient, poolWidePromotionIds)

            await Promise.allSettled(
              vaults.vaultAddresses[chainId].map((vaultAddress) =>
                (async () => {
                  const allVaultTokensPerEpoch = await getPoolWidePromotionVaultTokensPerEpoch(
                    publicClient,
                    vaultAddress,
                    allPromotionInfo
                  )

                  poolWidePromotionCreatedEvents?.[chainId]?.forEach((promotionCreatedEvent) => {
                    const id = promotionCreatedEvent.args.promotionId.toString()

                    promotions[id] = {
                      startTimestamp: BigInt(promotionCreatedEvent.args.startTimestamp),
                      vault: vaultAddress,
                      epochDuration: promotionCreatedEvent.args.epochDuration,
                      createdAtBlockNumber: promotionCreatedEvent.blockNumber,
                      token: promotionCreatedEvent.args.token,
                      tokensPerEpoch: promotionCreatedEvent.args.tokensPerEpoch,
                      vaultTokensPerEpoch: allVaultTokensPerEpoch[id],
                      ...allPromotionInfo[id]
                    }
                  })
                })()
              )
            )
          }

          return promotions
        },
        enabled: !!chainId && !!publicClient && isFetchedPoolWidePromotionCreatedEvents,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)
    const isFetching = results?.some((result) => result.isFetching)
    const refetch = () => results?.forEach((result) => result.refetch())

    const data: { [chainId: number]: { [id: string]: PartialPoolWidePromotionInfo } } = {}
    results.forEach((result, i) => {
      if (!!result.data) {
        data[vaults.chainIds[i]] = result.data
      }
    })

    return { isFetched, isFetching, refetch, data }
  }, [results])
}
