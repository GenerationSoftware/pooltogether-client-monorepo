import { Vaults } from '@generationsoftware/hyperstructure-client-js'
import { TokenWithPrice } from '@shared/types'
import {
  calculatePoolWideRewardsApr,
  calculateRewardsApr,
  getSecondsSinceEpoch,
  lower
} from '@shared/utilities'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import {
  useAllPoolWideVaultPromotions,
  useAllVaultPromotions,
  useAllVaultSharePrices,
  useAllVaultTotalDelegateSupplies,
  useTokenPrices,
  useTokens
} from '..'

/**
 * Returns each vault's bonus rewards APR
 * @param chainId the chain ID to query promotion info on
 * @param vaults instance of the `Vaults` class
 * @param tokenAddresses reward token addresses to consider
 * @param options optional settings
 * @returns
 */
export const useAllVaultPromotionsApr = (
  chainId: number,
  vaults: Vaults,
  tokenAddresses: Address[],
  options?: {
    fromBlock?: bigint
    twabRewardsAddress?: Address
  }
) => {
  const promotionOptions = !!chainId
    ? {
        [chainId]: {
          tokenAddresses,
          fromBlock: options?.fromBlock,
          twabRewardsAddress: options?.twabRewardsAddress
        }
      }
    : undefined

  const {
    data: allVaultPromotions,
    isFetched: isFetchedAllVaultPromotions,
    refetch: refetchAllVaultPromotions
  } = useAllVaultPromotions(vaults, promotionOptions)

  const {
    data: allPoolWideVaultPromotions,
    isFetched: isFetchedAllPoolWideVaultPromotions,
    refetch: refetchAllPoolWideVaultPromotions
  } = useAllPoolWideVaultPromotions(vaults, promotionOptions)

  const {
    data: allShareTokens,
    isFetched: isFetchedAllShareTokens,
    refetch: refetchAllShareTokens
  } = useAllVaultSharePrices(vaults)

  const { data: rewardTokenPrices, isFetched: isFetchedRewardTokenPrices } = useTokenPrices(
    chainId,
    tokenAddresses
  )
  const { data: rewardTokenData, isFetched: isFetchedRewardTokenData } = useTokens(
    chainId,
    tokenAddresses
  )

  const {
    data: allTotalDelegateSupplies,
    isFetched: isFetchedAllTotalDelegateSupplies,
    refetch: refetchAllTotalDelegateSupplies
  } = useAllVaultTotalDelegateSupplies(vaults)

  const data = useMemo(() => {
    const vaultPromotionAprs: { [vaultId: string]: number } = {}

    if (
      !!chainId &&
      !!allVaultPromotions?.[chainId] &&
      !!allPoolWideVaultPromotions?.[chainId] &&
      !!allShareTokens &&
      !!rewardTokenPrices &&
      !!rewardTokenData &&
      !!allTotalDelegateSupplies
    ) {
      const currentTimestamp = getSecondsSinceEpoch()

      Object.values(vaults.vaults)
        .filter((vault) => vault.chainId === chainId)
        .forEach((vault) => {
          const shareToken = allShareTokens[vault.id]
          const totalDelegateSupply = allTotalDelegateSupplies[vault.id]

          if (totalDelegateSupply === 0n || shareToken?.price === 0) {
            vaultPromotionAprs[vault.id] = 0
          } else if (!!totalDelegateSupply && !!shareToken?.price) {
            const tvl =
              parseFloat(formatUnits(totalDelegateSupply, shareToken.decimals)) * shareToken.price

            tokenAddresses.forEach((address) => {
              const rewardToken: TokenWithPrice = {
                ...rewardTokenData[address],
                price: rewardTokenPrices[lower(address)]
              }

              if (!!rewardToken.price && rewardToken.decimals !== undefined) {
                const promotions = Object.values(allVaultPromotions[vault.chainId]).filter(
                  (promotion) =>
                    lower(promotion.token) === lower(rewardToken.address) &&
                    lower(promotion.vault) === lower(vault.address)
                )

                promotions.forEach((promotion) => {
                  const promotionApr = calculateRewardsApr(promotion, rewardToken, tvl, {
                    currentTimestamp
                  })

                  if (vaultPromotionAprs[vault.id] === undefined) {
                    vaultPromotionAprs[vault.id] = 0
                  }
                  vaultPromotionAprs[vault.id] += promotionApr
                })

                const poolWidePromotions = allPoolWideVaultPromotions[vault.chainId].filter(
                  (promotion) =>
                    lower(promotion.info.token) === lower(rewardToken.address) &&
                    lower(promotion.info.vault) === lower(vault.address)
                )

                poolWidePromotions.forEach((promotion) => {
                  const promotionApr = calculatePoolWideRewardsApr(
                    promotion.info,
                    rewardToken,
                    tvl,
                    { currentTimestamp }
                  )

                  if (vaultPromotionAprs[vault.id] === undefined) {
                    vaultPromotionAprs[vault.id] = 0
                  }
                  vaultPromotionAprs[vault.id] += promotionApr
                })
              }
            })
          }
        })
    }

    return vaultPromotionAprs
  }, [
    allVaultPromotions,
    allPoolWideVaultPromotions,
    allShareTokens,
    rewardTokenPrices,
    rewardTokenData,
    allTotalDelegateSupplies
  ])

  const isFetched =
    isFetchedAllVaultPromotions &&
    isFetchedAllPoolWideVaultPromotions &&
    isFetchedAllShareTokens &&
    isFetchedRewardTokenPrices &&
    isFetchedRewardTokenData &&
    isFetchedAllTotalDelegateSupplies

  const refetch = () => {
    refetchAllVaultPromotions()
    refetchAllPoolWideVaultPromotions()
    refetchAllShareTokens()
    refetchAllTotalDelegateSupplies()
  }

  return { data, isFetched, refetch }
}
