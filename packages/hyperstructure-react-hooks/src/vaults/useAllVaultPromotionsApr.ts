import { PrizePool, Vaults } from '@generationsoftware/hyperstructure-client-js'
import { TokenWithPrice } from '@shared/types'
import { getSecondsSinceEpoch, SECONDS_PER_YEAR } from '@shared/utilities'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import {
  useAllVaultPromotions,
  useAllVaultSharePrices,
  useDrawPeriod,
  useTokenPrices,
  useTokens
} from '..'

/**
 * Returns each vault's bonus rewards APR
 *
 * NOTE: `numDraws` looks ahead towards the future
 * @param vaults instance of the `Vaults` class
 * @param prizePool instance of the `PrizePool` class
 * @param tokenAddresses reward token addresses to consider
 * @param options optional settings
 * @returns
 */
export const useAllVaultPromotionsApr = (
  vaults: Vaults,
  prizePool: PrizePool,
  tokenAddresses: Address[],
  options?: {
    numDraws?: number
    fromBlock?: bigint
    twabRewardsAddress?: Address
  }
) => {
  const promotionOptions = !!prizePool
    ? {
        [prizePool.chainId]: {
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

  const { data: drawPeriod, isFetched: isFetchedDrawPeriod } = useDrawPeriod(prizePool)

  const {
    data: allShareTokens,
    isFetched: isFetchedAllShareTokens,
    refetch: refetchAllShareTokens
  } = useAllVaultSharePrices(vaults)

  const { data: rewardTokenPrices, isFetched: isFetchedRewardTokenPrices } = useTokenPrices(
    prizePool?.chainId,
    tokenAddresses
  )
  const { data: rewardTokenData, isFetched: isFetchedRewardTokenData } = useTokens(
    prizePool?.chainId,
    tokenAddresses
  )

  const data = useMemo(() => {
    const vaultPromotionAprs: { [vaultId: string]: number } = {}

    if (
      !!prizePool &&
      !!allVaultPromotions?.[prizePool.chainId] &&
      !!drawPeriod &&
      !!allShareTokens &&
      !!rewardTokenPrices &&
      !!rewardTokenData
    ) {
      const yearlyDraws = SECONDS_PER_YEAR / drawPeriod
      const numDraws = options?.numDraws ?? 7
      const currentTimestamp = getSecondsSinceEpoch()
      const maxTimestamp = currentTimestamp + numDraws * drawPeriod

      Object.values(vaults.vaults)
        .filter((vault) => vault.chainId === prizePool.chainId)
        .forEach((vault) => {
          const shareToken = allShareTokens[vault.id]
          let futureRewards = 0

          if (shareToken?.totalSupply === 0n || shareToken?.price === 0) {
            vaultPromotionAprs[vault.id] = 0
          } else if (!!shareToken?.price) {
            tokenAddresses.forEach((address) => {
              const rewardToken: TokenWithPrice = {
                ...rewardTokenData[address],
                price: rewardTokenPrices[address.toLowerCase() as Address]
              }

              if (!!rewardToken.price && rewardToken.decimals !== undefined) {
                const promotions = Object.values(allVaultPromotions[vault.chainId]).filter(
                  (promotion) =>
                    promotion.token.toLowerCase() === rewardToken.address.toLowerCase() &&
                    promotion.vault.toLowerCase() === vault.address.toLowerCase()
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
              parseFloat(formatUnits(shareToken.totalSupply, shareToken.decimals)) *
              shareToken.price

            vaultPromotionAprs[vault.id] = (yearlyRewards / tvl) * 100
          }
        })
    }

    return vaultPromotionAprs
  }, [allVaultPromotions, drawPeriod, allShareTokens, rewardTokenPrices, rewardTokenData])

  const isFetched =
    isFetchedAllVaultPromotions &&
    isFetchedDrawPeriod &&
    isFetchedAllShareTokens &&
    isFetchedRewardTokenPrices &&
    isFetchedRewardTokenData

  const refetch = () => {
    refetchAllVaultPromotions()
    refetchAllShareTokens()
  }

  return { data, isFetched, refetch }
}
