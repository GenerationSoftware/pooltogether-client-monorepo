import { PrizePool, Vaults } from '@generationsoftware/hyperstructure-client-js'
import { useMemo } from 'react'
import { formatUnits } from 'viem'
import { useAllVaultPercentageContributions, useAllVaultSharePrices } from '..'

/**
 * Returns each vault's prize power on a given prize pool
 *
 * Stores queried vault prize powers in cache
 * @param vaults instance of the `Vaults` class
 * @param prizePool instance of the `PrizePool` class
 * @param options optional settings
 * @returns
 */
export const useAllVaultPrizePowers = (
  vaults: Vaults,
  prizePool: PrizePool,
  options?: {
    numDraws?: number
  }
) => {
  const {
    data: percentageContributions,
    isFetched: isFetchedPercentageContributions,
    refetch: refetchPercentageContributions
  } = useAllVaultPercentageContributions([prizePool], vaults, options?.numDraws)

  const { data: allShareTokens, isFetched: isFetchedAllShareTokens } =
    useAllVaultSharePrices(vaults)

  const data = useMemo(() => {
    const prizePowers: { [vaultId: string]: number } = {}

    if (!!percentageContributions && !!allShareTokens) {
      Object.entries(percentageContributions).forEach(([vaultId, percentageContribution]) => {
        const shareToken = allShareTokens[vaultId]

        if (percentageContribution === 0 || shareToken?.price === 0) {
          prizePowers[vaultId] = 0
        } else if (!!percentageContribution && !!shareToken?.price) {
          const supply = parseFloat(formatUnits(shareToken.totalSupply, shareToken.decimals))
          const tvl = supply * shareToken.price

          if (tvl >= 1) {
            prizePowers[vaultId] = percentageContribution / tvl
          }
        }
      })
    }

    return prizePowers
  }, [percentageContributions])

  const isFetched = isFetchedPercentageContributions && isFetchedAllShareTokens

  const refetch = () => {
    refetchPercentageContributions()
  }

  return { data, isFetched, refetch }
}
