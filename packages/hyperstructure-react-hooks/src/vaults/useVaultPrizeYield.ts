import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import { SECONDS_PER_YEAR } from '@shared/utilities'
import { useMemo } from 'react'
import { formatUnits } from 'viem'
import {
  useDrawPeriod,
  useLastAwardedDrawId,
  usePrizeTokenPrice,
  useVaultContributionAmount,
  useVaultSharePrice,
  useVaultTotalSupplyTwab
} from '..'

/**
 * Returns a vault's prize yield percentage
 * @param vault instance of the `Vault` class
 * @param prizePool instance of the `PrizePool` class
 * @param options optional settings
 * @returns
 */
export const useVaultPrizeYield = (
  vault: Vault,
  prizePool: PrizePool,
  options?: {
    numDraws?: number
  }
) => {
  const {
    data: vaultContribution,
    isFetched: isFetchedVaultContribution,
    refetch: refetchVaultContribution
  } = useVaultContributionAmount(prizePool, vault, options?.numDraws)

  const {
    data: totalSupplyTwab,
    isFetched: isFetchedTotalSupplyTwab,
    refetch: refetchTotalSupplyTwab
  } = useVaultTotalSupplyTwab(prizePool, vault, options?.numDraws)

  const { data: shareToken, isFetched: isFetchedShareToken } = useVaultSharePrice(vault)
  const { data: prizeToken, isFetched: isFetchedPrizeToken } = usePrizeTokenPrice(prizePool)

  const { data: drawPeriod, isFetched: isFetchedDrawPeriod } = useDrawPeriod(prizePool)

  const { data: lastDrawId, isFetched: isFetchedLastDrawId } = useLastAwardedDrawId(prizePool)

  const data = useMemo(() => {
    if (
      vaultContribution === 0n ||
      totalSupplyTwab === 0n ||
      shareToken?.price === 0 ||
      prizeToken?.price === 0
    ) {
      return 0
    }

    if (
      !!vaultContribution &&
      !!totalSupplyTwab &&
      !!shareToken?.price &&
      !!prizeToken?.price &&
      !!drawPeriod
    ) {
      const yearlyDraws = SECONDS_PER_YEAR / drawPeriod
      const numDrawsConsidered = Math.min(options?.numDraws ?? 7, lastDrawId || 1)
      const yearlyContribution =
        parseFloat(formatUnits(vaultContribution, prizeToken.decimals)) *
        (yearlyDraws / numDrawsConsidered)
      const yearlyContributionValue = yearlyContribution * prizeToken.price
      const tvl = parseFloat(formatUnits(totalSupplyTwab, shareToken.decimals)) * shareToken.price

      return (yearlyContributionValue / tvl) * 100
    }
  }, [vaultContribution, totalSupplyTwab, shareToken, prizeToken, drawPeriod, lastDrawId])

  const isFetched =
    isFetchedVaultContribution &&
    isFetchedTotalSupplyTwab &&
    isFetchedShareToken &&
    isFetchedPrizeToken &&
    isFetchedDrawPeriod &&
    isFetchedLastDrawId

  const refetch = () => {
    refetchVaultContribution()
    refetchTotalSupplyTwab()
  }

  return { data, isFetched, refetch }
}
