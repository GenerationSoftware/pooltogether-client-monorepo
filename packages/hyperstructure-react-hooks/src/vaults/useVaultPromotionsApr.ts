import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import { TokenWithPrice } from '@shared/types'
import { getSecondsSinceEpoch, lower, SECONDS_PER_YEAR } from '@shared/utilities'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import {
  useDrawPeriod,
  useTokenPrices,
  useTokens,
  useVaultPromotions,
  useVaultSharePrice
} from '..'

/**
 * Returns a vault's bonus rewards APR
 *
 * NOTE: `numDraws` looks ahead towards the future
 * @param vault instance of the `Vault` class
 * @param prizePool instance of the `PrizePool` class
 * @param tokenAddresses reward token addresses to consider
 * @param options optional settings
 * @returns
 */
export const useVaultPromotionsApr = (
  vault: Vault,
  prizePool: PrizePool,
  tokenAddresses: Address[],
  options?: {
    numDraws?: number
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

  const { data: drawPeriod, isFetched: isFetchedDrawPeriod } = useDrawPeriod(prizePool)

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

  const data = useMemo(() => {
    if (shareToken?.totalSupply === 0n || shareToken?.price === 0) {
      return { apr: 0, tokens: [] }
    }

    if (
      !!vaultPromotions &&
      !!drawPeriod &&
      !!shareToken &&
      !!shareToken.price &&
      !!rewardTokenPrices &&
      !!rewardTokenData
    ) {
      const yearlyDraws = SECONDS_PER_YEAR / drawPeriod
      const numDraws = options?.numDraws ?? 7
      const currentTimestamp = getSecondsSinceEpoch()
      const maxTimestamp = currentTimestamp + numDraws * drawPeriod

      const allTokenRewardsValue: { [tokenAddress: Address]: number } = {}
      let futureRewards = 0

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
            const epochDuration = promotion.epochDuration
            const endsAt = startsAt + numberOfEpochs * epochDuration
            const tokensPerEpoch = promotion.tokensPerEpoch

            if (
              !!startsAt &&
              startsAt < maxTimestamp &&
              endsAt > currentTimestamp &&
              startsAt !== endsAt
            ) {
              let numValidEpochs = 0

              for (let i = 0; i < numberOfEpochs; i++) {
                const epochEndsAt = startsAt + epochDuration * (i + 1)
                if (epochEndsAt > currentTimestamp && epochEndsAt < maxTimestamp) {
                  numValidEpochs++
                }
              }

              const tokenRewards =
                parseFloat(formatUnits(tokensPerEpoch, rewardToken.decimals)) * numValidEpochs
              const tokenRewardsValue = tokenRewards * (rewardToken.price ?? 0)

              if (allTokenRewardsValue[tokenAddress] === undefined) {
                allTokenRewardsValue[tokenAddress] = 0
              }

              allTokenRewardsValue[tokenAddress] += tokenRewardsValue
              futureRewards += tokenRewardsValue
            }
          })
        }
      })

      const yearlyRewards = futureRewards * (yearlyDraws / numDraws)
      const tvl =
        parseFloat(formatUnits(shareToken.totalSupply, shareToken.decimals)) * shareToken.price
      const apr = (yearlyRewards / tvl) * 100

      const promotionTokenAddresses = Object.entries(allTokenRewardsValue)
        .filter((entry) => !!entry[1])
        .sort((a, b) => b[1] - a[1])
        .map((entry) => entry[0] as Address)
      const promotionTokens = promotionTokenAddresses.map((tokenAddress) => getToken(tokenAddress))

      return { apr, tokens: promotionTokens }
    }
  }, [vaultPromotions, drawPeriod, shareToken, rewardTokenPrices, rewardTokenData])

  const isFetched =
    isFetchedVaultPromotions &&
    isFetchedDrawPeriod &&
    isFetchedShareToken &&
    isFetchedRewardTokenPrices &&
    isFetchedRewardTokenData

  const refetch = () => {
    refetchVaultPromotions()
    refetchShareToken()
  }

  return { data, isFetched, refetch }
}
