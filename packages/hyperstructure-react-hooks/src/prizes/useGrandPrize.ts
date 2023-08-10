import { PrizePool, TokenWithAmount, TokenWithPrice } from '@pooltogether/hyperstructure-client-js'
import { useMemo } from 'react'
import { useAllPrizeInfo, usePrizeTokenPrice } from '..'

/**
 * Returns the prize pool's grand prize
 *
 * Wraps {@link useAllPrizeInfo}
 * @param prizePool instance of `PrizePool` to check
 * @returns
 */
export const useGrandPrize = (
  prizePool: PrizePool
): {
  data?: TokenWithAmount & TokenWithPrice
  isFetched: boolean
} => {
  const { data: allPrizeInfo, isFetched: isFetchedAllPrizeInfo } = useAllPrizeInfo([prizePool])

  const { data: tokenWithPrice, isFetched: isFetchedTokenPrice } = usePrizeTokenPrice(prizePool)

  const isFetched = isFetchedAllPrizeInfo && isFetchedTokenPrice

  const data = useMemo(() => {
    if (isFetched && !!allPrizeInfo?.[prizePool.id] && !!tokenWithPrice) {
      const grandPrizeAmount = allPrizeInfo[prizePool.id][0].amount
      return { ...tokenWithPrice, amount: grandPrizeAmount }
    } else {
      return undefined
    }
  }, [allPrizeInfo, tokenWithPrice])

  return { data, isFetched }
}
