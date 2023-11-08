import { PrizePool, Vaults } from '@generationsoftware/hyperstructure-client-js'
import { useMemo } from 'react'
import { formatUnits } from 'viem'
import {
  useAllVaultPercentageContributions,
  useAllVaultSharePrices,
  useAllVaultTotalSupplyTwabs
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
    data: percentageContributions,
    isFetched: isFetchedPercentageContributions,
    refetch: refetchPercentageContributions
  } = useAllVaultPercentageContributions([prizePool], vaults, options?.numDraws)

  const {
    data: totalSupplyTwabs,
    isFetched: isFetchedTotalSupplyTwabs,
    refetch: refetchTotalSupplyTwabs
  } = useAllVaultTotalSupplyTwabs(vaults, prizePool, options?.numDraws)

  const { data: allShareTokens, isFetched: isFetchedAllShareTokens } =
    useAllVaultSharePrices(vaults)

  const data = useMemo(() => {
    const prizeYields: { [vaultId: string]: number } = {}

    if (!!percentageContributions && !!totalSupplyTwabs && !!allShareTokens) {
      Object.entries(percentageContributions).forEach(([vaultId, percentageContribution]) => {
        const totalSupplyTwab = totalSupplyTwabs[vaultId]
        const shareToken = allShareTokens[vaultId]

        if (percentageContribution === 0 || totalSupplyTwab === 0n || shareToken?.price === 0) {
          prizeYields[vaultId] = 0
        } else if (!!percentageContribution && !!totalSupplyTwab && !!shareToken?.price) {
          const supply = parseFloat(formatUnits(totalSupplyTwab, shareToken.decimals))
          const tvl = supply * shareToken.price

          if (tvl >= 1) {
            prizeYields[vaultId] = percentageContribution / tvl
          }
        }
      })
    }

    return prizeYields
  }, [percentageContributions, totalSupplyTwabs, allShareTokens])

  const isFetched =
    isFetchedPercentageContributions && isFetchedTotalSupplyTwabs && isFetchedAllShareTokens

  const refetch = () => {
    refetchPercentageContributions()
    refetchTotalSupplyTwabs()
  }

  return { data, isFetched, refetch }
}
