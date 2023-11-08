import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import { useMemo } from 'react'
import { formatUnits } from 'viem'
import { useVaultPercentageContribution, useVaultSharePrice, useVaultTotalSupplyTwab } from '..'

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
    data: percentageContribution,
    isFetched: isFetchedPercentageContribution,
    refetch: refetchPercentageContribution
  } = useVaultPercentageContribution(prizePool, vault, options?.numDraws)

  const {
    data: totalSupplyTwab,
    isFetched: isFetchedTotalSupplyTwab,
    refetch: refetchTotalSupplyTwab
  } = useVaultTotalSupplyTwab(prizePool, vault, options?.numDraws)

  const { data: shareToken, isFetched: isFetchedShareToken } = useVaultSharePrice(vault)

  const data = useMemo(() => {
    if (percentageContribution === 0 || totalSupplyTwab === 0n || shareToken?.price === 0) return 0

    if (!!percentageContribution && !!totalSupplyTwab && !!shareToken?.price) {
      const supply = parseFloat(formatUnits(totalSupplyTwab, shareToken.decimals))
      const tvl = supply * shareToken.price

      if (tvl >= 1) {
        return percentageContribution / tvl
      }
    }
  }, [percentageContribution, totalSupplyTwab, shareToken])

  const isFetched =
    isFetchedPercentageContribution && isFetchedTotalSupplyTwab && isFetchedShareToken

  const refetch = () => {
    refetchPercentageContribution()
    refetchTotalSupplyTwab()
  }

  return { data, isFetched, refetch }
}
