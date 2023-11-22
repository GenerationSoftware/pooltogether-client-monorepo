import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import { TokenWithPrice } from '@shared/types'
import { getSecondsSinceEpoch, SECONDS_PER_YEAR } from '@shared/utilities'
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
  }
) => {
  const {
    data: vaultPromotions,
    isFetched: isFetchedVaultPromotions,
    refetch: refetchVaultPromotions
  } = useVaultPromotions(vault, { tokenAddresses, fromBlock: options?.fromBlock })

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
      return 0
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
      let futureRewards = 0

      tokenAddresses.forEach((address) => {
        const rewardToken: TokenWithPrice = {
          ...rewardTokenData[address],
          price: rewardTokenPrices[address.toLowerCase() as Address]
        }

        if (!!rewardToken.price && rewardToken.decimals !== undefined) {
          const promotions = Object.values(vaultPromotions).filter(
            (promotion) => promotion.token.toLowerCase() === rewardToken.address.toLowerCase()
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
              futureRewards += tokenRewards * (rewardToken.price ?? 0)
            }
          })
        }
      })

      const yearlyRewards = futureRewards * (yearlyDraws / numDraws)
      const tvl =
        parseFloat(formatUnits(shareToken.totalSupply, shareToken.decimals)) * shareToken.price

      return (yearlyRewards / tvl) * 100
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
