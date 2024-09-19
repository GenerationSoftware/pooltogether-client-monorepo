import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { TokenWithPrice } from '@shared/types'
import { getSecondsSinceEpoch, lower, SECONDS_PER_YEAR } from '@shared/utilities'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import {
  useTokenPrices,
  useTokens,
  useVaultPromotions,
  useVaultSharePrice,
  useVaultTotalDelegateSupply
} from '..'

/**
 * Returns a vault's bonus rewards APR
 * @param vault instance of the `Vault` class
 * @param tokenAddresses reward token addresses to consider
 * @param options optional settings
 * @returns
 */
export const useVaultPromotionsApr = (
  vault: Vault,
  tokenAddresses: Address[],
  options?: {
    fromBlock?: bigint
    twabRewardsAddress?: Address
  }
) => {
  const {
    data: vaultPromotions,
    isFetched: isFetchedVaultPromotions,
    refetch: refetchVaultPromotions
  } = useVaultPromotions(vault, {
    tokenAddresses,
    fromBlock: options?.fromBlock,
    twabRewardsAddress: options?.twabRewardsAddress
  })

  const {
    data: shareToken,
    isFetched: isFetchedShareToken,
    refetch: refetchShareToken
  } = useVaultSharePrice(vault)

  const { data: rewardTokenPrices, isFetched: isFetchedRewardTokenPrices } = useTokenPrices(
    vault?.chainId,
    tokenAddresses
  )
  const { data: rewardTokenData, isFetched: isFetchedRewardTokenData } = useTokens(
    vault?.chainId,
    tokenAddresses
  )

  const {
    data: totalDelegateSupply,
    isFetched: isFetchedTotalDelegateSupply,
    refetch: refetchTotalDelegateSupply
  } = useVaultTotalDelegateSupply(vault)

  const data = useMemo(() => {
    if (totalDelegateSupply === 0n || shareToken?.price === 0) {
      return { apr: 0, tokens: [] }
    }

    if (
      !!vaultPromotions &&
      !!shareToken?.price &&
      !!rewardTokenPrices &&
      !!rewardTokenData &&
      !!totalDelegateSupply
    ) {
      const currentTimestamp = getSecondsSinceEpoch()
      const tvl =
        parseFloat(formatUnits(totalDelegateSupply, shareToken.decimals)) * shareToken.price

      const relevantTokenAddresses = new Set<Address>()
      let apr = 0

      const getToken = (address: Address): TokenWithPrice => ({
        ...rewardTokenData[address],
        price: rewardTokenPrices[lower(address)]
      })

      tokenAddresses.forEach((tokenAddress) => {
        const rewardToken = getToken(tokenAddress)

        if (!!rewardToken.price && rewardToken.decimals !== undefined) {
          const promotions = Object.values(vaultPromotions).filter(
            (promotion) => lower(promotion.token) === lower(rewardToken.address)
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

                  apr += (yearlyRewardsValue / tvl) * 100
                  relevantTokenAddresses.add(rewardToken.address)
                }
              }
            }
          })
        }
      })

      const promotionTokens = [...relevantTokenAddresses].map((tokenAddress) =>
        getToken(tokenAddress)
      )

      return { apr, tokens: promotionTokens }
    }
  }, [vaultPromotions, shareToken, rewardTokenPrices, rewardTokenData, totalDelegateSupply])

  const isFetched =
    isFetchedVaultPromotions &&
    isFetchedShareToken &&
    isFetchedRewardTokenPrices &&
    isFetchedRewardTokenData &&
    isFetchedTotalDelegateSupply

  const refetch = () => {
    refetchVaultPromotions()
    refetchShareToken()
    refetchTotalDelegateSupply()
  }

  return { data, isFetched, refetch }
}
