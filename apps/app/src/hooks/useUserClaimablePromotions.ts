import {
  useAllUserClaimableRewards,
  useAllVaultPromotions,
  useSelectedVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { PartialPromotionInfo } from '@shared/types'
import { useMemo } from 'react'
import { Address } from 'viem'
import { TWAB_REWARDS_SETTINGS } from '@constants/config'

/**
 * Returns promotions user can claim rewards for
 * @param userAddress user address to get rewards for
 * @returns
 */
export const useUserClaimablePromotions = (userAddress: Address) => {
  const { vaults } = useSelectedVaults()

  const { data: allPromotions, isFetched: isFetchedAllPromotions } = useAllVaultPromotions(
    vaults,
    TWAB_REWARDS_SETTINGS
  )

  const {
    data: allClaimableRewards,
    isFetched: isFetchedAllClaimableRewards,
    refetch: refetchAllClaimableRewards
  } = useAllUserClaimableRewards(userAddress, allPromotions)

  const isFetched = isFetchedAllPromotions && isFetchedAllClaimableRewards
  const refetch = refetchAllClaimableRewards

  const data = useMemo(() => {
    const claimablePromotions: ({
      chainId: number
      promotionId: bigint
      epochRewards: { [epochId: number]: bigint }
    } & PartialPromotionInfo)[] = []

    const chainIds = Object.keys(allClaimableRewards).map((k) => parseInt(k))

    chainIds.forEach((chainId) => {
      Object.entries(allClaimableRewards[chainId]).forEach(([id, epochRewards]) => {
        const promotionInfo = allPromotions[chainId]?.[id]

        if (!!promotionInfo) {
          const filteredEpochRewards: { [epochId: number]: bigint } = {}

          const epochIds = Object.keys(epochRewards).map((k) => parseInt(k))
          epochIds.forEach((epochId) => {
            if (epochRewards[epochId] > 0n) {
              filteredEpochRewards[epochId] = epochRewards[epochId]
            }
          })

          claimablePromotions.push({
            chainId,
            promotionId: BigInt(id),
            epochRewards: filteredEpochRewards,
            ...promotionInfo
          })
        }
      })
    })

    return claimablePromotions
  }, [isFetched, allPromotions, allClaimableRewards])

  return { data, isFetched, refetch }
}
