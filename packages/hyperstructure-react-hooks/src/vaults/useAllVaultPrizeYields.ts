import { PrizePool, Vaults } from '@generationsoftware/hyperstructure-client-js'
import { SECONDS_PER_YEAR } from '@shared/utilities'
import { useMemo } from 'react'
import { formatUnits } from 'viem'
import {
  useAllDrawPeriods,
  useAllLastAwardedDrawIds,
  useAllPrizeTokenPrices,
  useAllVaultContributionAmounts,
  useAllVaultSharePrices,
  useAllVaultTotalSupplyTwabs
} from '..'

/**
 * Returns each vault's prize yield percentage on their respective prize pool
 * @param vaults instance of the `Vaults` class
 * @param prizePools instances of the `PrizePool` class
 * @param options optional settings
 * @returns
 */
export const useAllVaultPrizeYields = (
  vaults: Vaults,
  prizePools: PrizePool[],
  options?: {
    numDraws?: number
  }
) => {
  const {
    data: vaultContributions,
    isFetched: isFetchedVaultContributions,
    refetch: refetchVaultContributions
  } = useAllVaultContributionAmounts(prizePools, vaults, options?.numDraws)

  const {
    data: totalSupplyTwabs,
    isFetched: isFetchedTotalSupplyTwabs,
    refetch: refetchTotalSupplyTwabs
  } = useAllVaultTotalSupplyTwabs(vaults, prizePools, options?.numDraws)

  const { data: allShareTokens, isFetched: isFetchedAllShareTokens } =
    useAllVaultSharePrices(vaults)

  const { data: prizeTokens, isFetched: isFetchedPrizeTokens } = useAllPrizeTokenPrices(prizePools)

  const { data: drawPeriods, isFetched: isFetchedDrawPeriods } = useAllDrawPeriods(prizePools)

  const { data: lastDrawIds, isFetched: isFetchedLastDrawIds } =
    useAllLastAwardedDrawIds(prizePools)

  const isFetched =
    isFetchedVaultContributions &&
    isFetchedTotalSupplyTwabs &&
    isFetchedAllShareTokens &&
    isFetchedPrizeTokens &&
    isFetchedDrawPeriods &&
    isFetchedLastDrawIds

  const data = useMemo(() => {
    const prizeYields: { [vaultId: string]: number } = {}

    if (isFetched && !!allShareTokens) {
      Object.values(vaults.vaults).forEach((vault) => {
        const prizePool = prizePools.find((pool) => pool.chainId === vault.chainId)

        if (!!prizePool) {
          const prizeToken = prizeTokens[prizePool.id]
          const drawPeriod = drawPeriods[prizePool.id]

          if (!!prizeToken && !!drawPeriod) {
            const vaultContribution = vaultContributions[vault.id]
            const totalSupplyTwab = totalSupplyTwabs[vault.id]
            const shareToken = allShareTokens[vault.id]
            const yearlyDraws = SECONDS_PER_YEAR / drawPeriod
            const numDrawsConsidered = Math.min(
              options?.numDraws ?? 7,
              lastDrawIds[prizePool.id] || 1
            )

            if (
              vaultContribution === 0n ||
              totalSupplyTwab === 0n ||
              shareToken?.price === 0 ||
              prizeToken.price === 0
            ) {
              prizeYields[vault.id] = 0
            } else if (
              !!vaultContribution &&
              !!totalSupplyTwab &&
              !!shareToken?.price &&
              !!prizeToken.price
            ) {
              const yearlyContribution =
                parseFloat(formatUnits(vaultContribution, prizeToken.decimals)) *
                (yearlyDraws / numDrawsConsidered)
              const yearlyContributionValue = yearlyContribution * prizeToken.price
              const tvl =
                parseFloat(formatUnits(totalSupplyTwab, shareToken.decimals)) * shareToken.price

              prizeYields[vault.id] = (yearlyContributionValue / tvl) * 100
            }
          }
        }
      })
    }

    return prizeYields
  }, [
    vaultContributions,
    totalSupplyTwabs,
    allShareTokens,
    prizeTokens,
    drawPeriods,
    lastDrawIds,
    isFetched
  ])

  const refetch = () => {
    refetchVaultContributions()
    refetchTotalSupplyTwabs()
  }

  return { data, isFetched, refetch }
}
