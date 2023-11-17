import {
  useAllVaultPromotions,
  usePromotionRewardsClaimedEventsAcrossChains,
  useSelectedVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { PartialPromotionInfo } from '@shared/types'
import { useMemo } from 'react'
import { Address } from 'viem'
import { TWAB_REWARDS_SETTINGS } from '@constants/config'

/**
 * Returns promotions user has claimed rewards for
 * @param userAddress user address to get claimed rewards for
 * @returns
 */
export const useUserClaimedPromotions = (userAddress: Address) => {
  const { vaults } = useSelectedVaults()

  const { data: allPromotions, isFetched: isFetchedAllPromotions } = useAllVaultPromotions(
    vaults,
    TWAB_REWARDS_SETTINGS
  )

  const eventQueryOptions = useMemo(() => {
    const chainIds = Object.keys(allPromotions).map((k) => parseInt(k))

    if (!!userAddress && chainIds.length > 0) {
      const options: {
        [chainId: number]: {
          promotionIds?: bigint[]
          userAddresses?: `0x${string}`[]
          fromBlock?: bigint
          toBlock?: bigint
        }
      } = {}

      chainIds.forEach((chainId) => {
        options[chainId] = {
          promotionIds: !!allPromotions[chainId]
            ? Object.keys(allPromotions[chainId]).map(BigInt)
            : [],
          userAddresses: [userAddress],
          fromBlock: TWAB_REWARDS_SETTINGS[chainId]?.fromBlock
        }
      })

      return options
    }
  }, [userAddress, allPromotions])

  const {
    data: allClaimEvents,
    isFetched: isFetchedAllClaimEvents,
    refetch: refetchAllClaimEvents
  } = usePromotionRewardsClaimedEventsAcrossChains(vaults.chainIds, eventQueryOptions)

  const isFetched = isFetchedAllPromotions && isFetchedAllClaimEvents
  const refetch = refetchAllClaimEvents

  const data = useMemo(() => {
    const claimedPromotions: ({
      chainId: number
      promotionId: bigint
      epochIds: number[]
      totalClaimed: bigint
    } & PartialPromotionInfo)[] = []

    Object.keys(allClaimEvents).forEach((key) => {
      const chainId = parseInt(key)

      allClaimEvents[chainId].forEach((claimEvent) => {
        const promotionId = claimEvent.args.promotionId
        const epochIds = [...claimEvent.args.epochIds]
        const amountClaimed = claimEvent.args.amount

        const existingEntryIndex = claimedPromotions.findIndex(
          (entry) => entry.chainId === chainId && entry.promotionId === promotionId
        )

        if (existingEntryIndex === -1) {
          const promotionInfo = allPromotions[chainId]?.[promotionId.toString()]

          if (!!promotionInfo) {
            claimedPromotions.push({
              chainId,
              promotionId,
              epochIds,
              totalClaimed: amountClaimed,
              ...promotionInfo
            })
          }
        } else {
          claimedPromotions[existingEntryIndex].epochIds.push(...epochIds)
          claimedPromotions[existingEntryIndex].totalClaimed += amountClaimed
        }
      })
    })

    return claimedPromotions
  }, [isFetched, allPromotions, allClaimEvents])

  return { data, isFetched, refetch }
}
