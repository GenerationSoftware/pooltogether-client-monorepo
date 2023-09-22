import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import { useMemo } from 'react'
import { formatUnits } from 'viem'
import { useVaultPercentageContribution, useVaultSharePrice } from '..'

/**
 * Returns a vault's prize power
 * @param vault instance of the `Vault` class
 * @param prizePool instance of the `PrizePool` class
 * @param options optional settings
 * @returns
 */
export const useVaultPrizePower = (
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

  const { data: shareToken, isFetched: isFetchedShareToken } = useVaultSharePrice(vault)

  const data = useMemo(() => {
    if (percentageContribution === 0 || shareToken?.price === 0) return 0

    if (!!percentageContribution && !!shareToken?.price) {
      const supply = parseFloat(formatUnits(shareToken.totalSupply, shareToken.decimals))
      const tvl = supply * shareToken.price

      if (tvl >= 1) {
        return percentageContribution / tvl
      }
    }
  }, [percentageContribution, shareToken])

  const isFetched = isFetchedPercentageContribution && isFetchedShareToken

  const refetch = () => {
    refetchPercentageContribution()
  }

  return { data, isFetched, refetch }
}
