import {
  useAllPoolWideVaultPromotions,
  useAllUserClaimablePoolWideRewards,
  useSelectedVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { PartialPoolWidePromotionInfo } from '@shared/types'
import { lower } from '@shared/utilities'
import { useMemo } from 'react'
import { Address } from 'viem'
import { TWAB_REWARDS_SETTINGS } from '@constants/config'

/**
 * Returns pool-wide promotions user can claim rewards for
 * @param userAddress user address to get rewards for
 * @returns
 */
export const useUserClaimablePoolWidePromotions = (userAddress: Address) => {
  const { vaults } = useSelectedVaults()

  const { data: allPoolWidePromotions, isFetched: isFetchedAllPoolWidePromotions } =
    useAllPoolWideVaultPromotions(vaults, TWAB_REWARDS_SETTINGS)

  const basicPromotionInfo = useMemo(() => {
    const basicInfo: {
      [chainId: number]: {
        [id: string]: {
          startTimestamp?: bigint | undefined
          numberOfEpochs?: number | undefined
          epochDuration?: number | undefined
        }
      }
    } = {}

    if (isFetchedAllPoolWidePromotions) {
      const chainIds = Object.keys(allPoolWidePromotions).map((k) => parseInt(k))

      chainIds.forEach((chainId) => {
        allPoolWidePromotions[chainId].forEach((promotion) => {
          if (basicInfo[chainId]?.[promotion.promotionId.toString()] === undefined) {
            if (basicInfo[chainId] === undefined) {
              basicInfo[chainId] = {}
            }

            basicInfo[chainId][promotion.promotionId.toString()] = {
              startTimestamp: promotion.info.startTimestamp,
              numberOfEpochs: promotion.info.numberOfEpochs,
              epochDuration: promotion.info.epochDuration
            }
          }
        })
      })
    }

    return basicInfo
  }, [allPoolWidePromotions, isFetchedAllPoolWidePromotions])

  const {
    data: allClaimableRewards,
    isFetched: isFetchedAllClaimableRewards,
    refetch: refetchAllClaimableRewards
  } = useAllUserClaimablePoolWideRewards(userAddress, vaults.vaultAddresses, basicPromotionInfo)

  const isFetched = isFetchedAllPoolWidePromotions && isFetchedAllClaimableRewards
  const refetch = refetchAllClaimableRewards

  const data = useMemo(() => {
    const claimablePromotions: ({
      chainId: number
      promotionId: bigint
      epochRewards: { [epochId: number]: bigint }
    } & PartialPoolWidePromotionInfo)[] = []

    const chainIds = Object.keys(allClaimableRewards).map((k) => parseInt(k))

    chainIds.forEach((chainId) => {
      allClaimableRewards[chainId].forEach((promotion) => {
        const promotionInfo = allPoolWidePromotions[chainId]?.find(
          (entry) =>
            entry.promotionId === promotion.promotionId &&
            lower(entry.info.vault) === lower(promotion.vaultAddress)
        )?.info

        if (!!promotionInfo) {
          const filteredEpochRewards: { [epochId: number]: bigint } = {}

          const epochIds = Object.keys(promotion.epochRewards).map((k) => parseInt(k))
          epochIds.forEach((epochId) => {
            if (promotion.epochRewards[epochId] > 0n) {
              filteredEpochRewards[epochId] = promotion.epochRewards[epochId]
            }
          })

          claimablePromotions.push({
            chainId,
            promotionId: BigInt(promotion.promotionId),
            epochRewards: filteredEpochRewards,
            ...promotionInfo
          })
        }
      })
    })

    return claimablePromotions
  }, [isFetched, allPoolWidePromotions, allClaimableRewards])

  return { data, isFetched, refetch }
}
