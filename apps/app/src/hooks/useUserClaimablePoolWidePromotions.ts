import {
  useAllPoolWideVaultPromotions,
  useAllUserClaimablePoolWideRewards,
  useSelectedVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { PartialPoolWidePromotionInfo } from '@shared/types'
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

  const {
    data: allClaimableRewards,
    isFetched: isFetchedAllClaimableRewards,
    refetch: refetchAllClaimableRewards
  } = useAllUserClaimablePoolWideRewards(userAddress, vaults.vaultAddresses, allPoolWidePromotions)

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
      Object.entries(allClaimableRewards[chainId]).forEach(([id, epochRewards]) => {
        const promotionInfo = allPoolWidePromotions[chainId]?.[id]

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
  }, [isFetched, allPoolWidePromotions, allClaimableRewards])

  return { data, isFetched, refetch }
}
