import {
  useAllPoolWideVaultPromotions,
  usePoolWidePromotionRewardsClaimedEventsAcrossChains,
  useSelectedVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { PartialPoolWidePromotionInfo } from '@shared/types'
import { decodePoolWideRewardsClaimFlags, lower } from '@shared/utilities'
import { useMemo } from 'react'
import { Address } from 'viem'
import { TWAB_REWARDS_SETTINGS } from '@constants/config'

/**
 * Returns pool-wide promotions user has claimed rewards for
 * @param userAddress user address to get claimed rewards for
 * @returns
 */
export const useUserClaimedPoolWidePromotions = (userAddress: Address) => {
  const { vaults } = useSelectedVaults()

  const { data: allPoolWidePromotions, isFetched: isFetchedAllPoolWidePromotions } =
    useAllPoolWideVaultPromotions(vaults, TWAB_REWARDS_SETTINGS)

  const eventQueryOptions = useMemo(() => {
    const chainIds = Object.keys(allPoolWidePromotions).map((k) => parseInt(k))

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
          promotionIds: !!allPoolWidePromotions[chainId]
            ? allPoolWidePromotions[chainId].map((entry) => BigInt(entry.promotionId))
            : [],
          userAddresses: [userAddress],
          fromBlock: TWAB_REWARDS_SETTINGS[chainId]?.fromBlock
        }
      })

      return options
    }
  }, [userAddress, allPoolWidePromotions])

  const {
    data: allClaimEvents,
    isFetched: isFetchedAllClaimEvents,
    refetch: refetchAllClaimEvents
  } = usePoolWidePromotionRewardsClaimedEventsAcrossChains(vaults.chainIds, eventQueryOptions)

  const isFetched = isFetchedAllPoolWidePromotions && isFetchedAllClaimEvents
  const refetch = refetchAllClaimEvents

  const data = useMemo(() => {
    const claimedPromotions: ({
      chainId: number
      promotionId: bigint
      epochIds: number[]
      totalClaimed: bigint
    } & PartialPoolWidePromotionInfo)[] = []

    Object.keys(allClaimEvents).forEach((key) => {
      const chainId = parseInt(key)

      allClaimEvents[chainId].forEach((claimEvent) => {
        const promotionId = claimEvent.args.promotionId
        const vaultAddress = lower(claimEvent.args.vault)
        const epochIds = decodePoolWideRewardsClaimFlags(claimEvent.args.epochClaimFlags)
        const amountClaimed = claimEvent.args.amount

        const existingEntryIndex = claimedPromotions.findIndex(
          (entry) =>
            entry.chainId === chainId &&
            entry.promotionId === promotionId &&
            lower(entry.vault) === vaultAddress
        )

        if (existingEntryIndex === -1) {
          const promotionInfo = allPoolWidePromotions[chainId]?.find(
            (entry) =>
              entry.promotionId === Number(promotionId) && lower(entry.info.vault) === vaultAddress
          )?.info

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
  }, [isFetched, allPoolWidePromotions, allClaimEvents])

  return { data, isFetched, refetch }
}
