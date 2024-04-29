import { PartialPromotionInfo } from '@shared/types'
import { lower } from '@shared/utilities'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useUserV5ClaimableRewards } from './useUserV5ClaimableRewards'
import { useV5AllPromotions } from './useV5AllPromotions'

export const useAllUserV5ClaimablePromotions = (userAddress: Address) => {
  const {
    data: allPromotions,
    isFetched: isFetchedAllPromotions,
    isFetching: isFetchingAllPromotions
  } = useV5AllPromotions()

  const {
    data: allClaimableRewards,
    isFetched: isFetchedAllClaimableRewards,
    isFetching: isFetchingAllClaimableRewards,
    refetch: refetchAllClaimableRewards
  } = useUserV5ClaimableRewards(userAddress, allPromotions)

  const isFetched = isFetchedAllPromotions && isFetchedAllClaimableRewards
  const isFetching = isFetchingAllPromotions || isFetchingAllClaimableRewards
  const refetch = refetchAllClaimableRewards

  const claimablePromotions = useMemo(() => {
    const promotions: ({
      chainId: number
      twabRewardsAddress: Lowercase<Address>
      promotionId: bigint
      epochRewards: { [epochId: number]: bigint }
    } & PartialPromotionInfo)[] = []

    Object.entries(allClaimableRewards).forEach(([strChainId, contracts]) => {
      const chainId = parseInt(strChainId)

      Object.entries(contracts).forEach(([address, entries]) => {
        const twabRewardsAddress = address as Lowercase<Address>

        Object.entries(entries).forEach(([promotionId, epochRewards]) => {
          const promotionInfo = allPromotions[chainId]?.[twabRewardsAddress]?.[promotionId]

          if (!!promotionInfo) {
            const filteredEpochRewards: { [epochId: number]: bigint } = {}

            const epochIds = Object.keys(epochRewards).map((k) => parseInt(k))
            epochIds.forEach((epochId) => {
              if (epochRewards[epochId] > 0n) {
                filteredEpochRewards[epochId] = epochRewards[epochId]
              }
            })

            promotions.push({
              chainId,
              twabRewardsAddress,
              promotionId: BigInt(promotionId),
              epochRewards: filteredEpochRewards,
              ...promotionInfo
            })
          }
        })
      })
    })

    return promotions
  }, [isFetched, allPromotions, allClaimableRewards])

  const data = useMemo(() => {
    const entries: {
      chainId: number
      twabRewardsAddress: Lowercase<Address>
      promotionId: bigint
      tokenAddress: Lowercase<Address>
      vaultAddress: Lowercase<Address>
      rewards: { [epochId: number]: bigint }
      total: bigint
    }[] = []

    claimablePromotions.forEach((promotion) => {
      entries.push({
        chainId: promotion.chainId,
        twabRewardsAddress: promotion.twabRewardsAddress,
        promotionId: promotion.promotionId,
        tokenAddress: lower(promotion.token),
        vaultAddress: lower(promotion.vault),
        rewards: promotion.epochRewards,
        total: Object.values(promotion.epochRewards).reduce((a, b) => a + b, 0n)
      })
    })

    return entries
  }, [claimablePromotions])

  return { data, isFetched, isFetching, refetch }
}

export const useUserV5ClaimablePromotions = (
  chainId: number,
  vaultAddress: Address,
  userAddress: Address
) => {
  const allUserV5ClaimablePromotions = useAllUserV5ClaimablePromotions(userAddress)

  const vaultPromotions = allUserV5ClaimablePromotions.data.filter(
    (entry) => entry.chainId === chainId && entry.vaultAddress === vaultAddress.toLowerCase()
  )

  return { ...allUserV5ClaimablePromotions, data: vaultPromotions }
}
