import { Vaults } from '@generationsoftware/hyperstructure-client-js'
import { TokenWithPrice } from '@shared/types'
import { getSecondsSinceEpoch, lower, SECONDS_PER_YEAR } from '@shared/utilities'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import { useAllVaultPromotions, useAllVaultSharePrices, useTokenPrices, useTokens } from '..'

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

  const data = useMemo(() => {
    const vaultPromotionAprs: { [vaultId: string]: number } = {}

    if (
      !!chainId &&
      !!allVaultPromotions?.[chainId] &&
      !!allShareTokens &&
      !!rewardTokenPrices &&
      !!rewardTokenData
    ) {
      const currentTimestamp = getSecondsSinceEpoch()

      Object.values(vaults.vaults)
        .filter((vault) => vault.chainId === chainId)
        .forEach((vault) => {
          const shareToken = allShareTokens[vault.id]

          if (shareToken?.totalSupply === 0n || shareToken?.price === 0) {
            vaultPromotionAprs[vault.id] = 0
          } else if (!!shareToken?.price) {
            const tvl =
              parseFloat(formatUnits(shareToken.totalSupply, shareToken.decimals)) *
              shareToken.price

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
                  const startsAt = Number(promotion.startTimestamp)
                  const numberOfEpochs = promotion.numberOfEpochs ?? 0
                  const endsAt = startsAt + numberOfEpochs * promotion.epochDuration

                  if (
                    !!startsAt &&
                    !!numberOfEpochs &&
                    !!endsAt &&
                    startsAt < currentTimestamp &&
                    endsAt > currentTimestamp
                  ) {
                    for (let i = 0; i < numberOfEpochs; i++) {
                      const epochStartsAt = startsAt + promotion.epochDuration * i
                      const epochEndsAt = epochStartsAt + promotion.epochDuration

                      if (epochStartsAt < currentTimestamp && epochEndsAt > currentTimestamp) {
                        const tokenRewards = parseFloat(
                          formatUnits(promotion.tokensPerEpoch, rewardToken.decimals)
                        )
                        const tokenRewardsValue = tokenRewards * (rewardToken.price ?? 0)
                        const yearlyRewardsValue =
                          tokenRewardsValue * (SECONDS_PER_YEAR / promotion.epochDuration)

                        if (vaultPromotionAprs[vault.id] === undefined) {
                          vaultPromotionAprs[vault.id] = 0
                        }

                        vaultPromotionAprs[vault.id] += (yearlyRewardsValue / tvl) * 100
                      }
                    }
                  }
                })
              }
            })
          }
        })
    }

    return vaultPromotionAprs
  }, [allVaultPromotions, allShareTokens, rewardTokenPrices, rewardTokenData])

  const isFetched =
    isFetchedAllVaultPromotions &&
    isFetchedAllShareTokens &&
    isFetchedRewardTokenPrices &&
    isFetchedRewardTokenData

  const refetch = () => {
    refetchAllVaultPromotions()
    refetchAllShareTokens()
  }

  return { data, isFetched, refetch }
}
