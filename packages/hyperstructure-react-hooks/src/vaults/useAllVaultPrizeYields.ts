import { PrizePool, Vaults } from '@generationsoftware/hyperstructure-client-js'
import { SECONDS_PER_YEAR } from '@shared/utilities'
import { useMemo } from 'react'
import { formatUnits } from 'viem'
import {
  useAllVaultContributionAmounts,
  useAllVaultSharePrices,
  useAllVaultTotalSupplyTwabs,
  useDrawPeriod,
  usePrizeTokenPrice
} from '..'

/**
 * Returns each vault's prize yield percentage on a given prize pool
 * @param vaults instance of the `Vaults` class
 * @param prizePool instance of the `PrizePool` class
 * @param options optional settings
 * @returns
 */
export const useAllVaultPrizeYields = (
  vaults: Vaults,
  prizePool: PrizePool,
  options?: {
    numDraws?: number
  }
) => {
  const {
    data: vaultContributions,
    isFetched: isFetchedVaultContributions,
    refetch: refetchVaultContributions
  } = useAllVaultContributionAmounts([prizePool], vaults, options?.numDraws)

  const {
    data: totalSupplyTwabs,
    isFetched: isFetchedTotalSupplyTwabs,
    refetch: refetchTotalSupplyTwabs
  } = useAllVaultTotalSupplyTwabs(vaults, prizePool, options?.numDraws)

  const { data: allShareTokens, isFetched: isFetchedAllShareTokens } =
    useAllVaultSharePrices(vaults)

  const { data: prizeToken, isFetched: isFetchedPrizeToken } = usePrizeTokenPrice(prizePool)

  const { data: drawPeriod, isFetched: isFetchedDrawPeriod } = useDrawPeriod(prizePool)

  const data = useMemo(() => {
    const prizeYields: { [vaultId: string]: number } = {}

    if (
      !!vaultContributions &&
      !!totalSupplyTwabs &&
      !!allShareTokens &&
      !!prizeToken &&
      !!drawPeriod
    ) {
      Object.entries(vaultContributions).forEach(([vaultId, vaultContribution]) => {
        const totalSupplyTwab = totalSupplyTwabs[vaultId]
        const shareToken = allShareTokens[vaultId]
        const yearlyDraws = SECONDS_PER_YEAR / drawPeriod

        if (
          vaultContribution === 0n ||
          totalSupplyTwab === 0n ||
          shareToken?.price === 0 ||
          prizeToken.price === 0
        ) {
          prizeYields[vaultId] = 0
        } else if (
          !!vaultContribution &&
          !!totalSupplyTwab &&
          !!shareToken?.price &&
          !!prizeToken.price
        ) {
          const yearlyContribution =
            parseFloat(formatUnits(vaultContribution, prizeToken.decimals)) *
            (yearlyDraws / (options?.numDraws ?? 7))
          const yearlyContributionValue = yearlyContribution * prizeToken.price
          const tvl =
            parseFloat(formatUnits(totalSupplyTwab, shareToken.decimals)) * shareToken.price

          prizeYields[vaultId] = (yearlyContributionValue / tvl) * 100
        }
      })
    }

    return prizeYields
  }, [vaultContributions, totalSupplyTwabs, allShareTokens, prizeToken, drawPeriod])

  const isFetched =
    isFetchedVaultContributions &&
    isFetchedTotalSupplyTwabs &&
    isFetchedAllShareTokens &&
    isFetchedPrizeToken &&
    isFetchedDrawPeriod

  const refetch = () => {
    refetchVaultContributions()
    refetchTotalSupplyTwabs()
  }

  return { data, isFetched, refetch }
}
