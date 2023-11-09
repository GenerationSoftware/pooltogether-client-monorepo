import {
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

  // TODO: query `getRewardsAmount` on twab rewards contract to find claimable rewards
  // ^ need function, hook and hook across chains
  // ^ should be able to calculate current epoch of each promotion based on info from `allPromotions` above

  const isFetched = isFetchedAllPromotions

  const data = useMemo(() => {
    const claimablePromotions: ({
      chainId: number
      promotionId: bigint
      epochRewards: { [epochId: number]: bigint }
    } & PartialPromotionInfo)[] = []

    // TODO: format data into type above

    return claimablePromotions
  }, [isFetched, allPromotions])

  return { data, isFetched }
}
