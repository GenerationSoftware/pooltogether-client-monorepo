import { PrizePool, TokenWithAmount, TokenWithPrice } from '@pooltogether/hyperstructure-client-js'
import { useMemo } from 'react'
import { useAllPrizeInfo, usePrizeTokenPrice } from '..'

/**
 * Returns data on the largest grand prize, along with the prize pool it belongs to
 *
 * Wraps {@link useAllPrizeInfo}
 * @param prizePools instances of `PrizePool` to check
 * @returns
 */
export const useLargestGrandPrize = (
  prizePools: PrizePool[]
): {
  data?: { prizePool: PrizePool; token: TokenWithAmount & TokenWithPrice }
  isFetched: boolean
} => {
  const { data: allPrizeInfo, isFetched: isFetchedAllPrizeInfo } = useAllPrizeInfo(prizePools)

  let largestGrandPrizeAmount = 0n

  const prizePoolId = useMemo(() => {
    let largestGrandPrizePoolId = ''

    for (const id in allPrizeInfo) {
      const prizeAmount = allPrizeInfo[id][0].amount
      if (prizeAmount > largestGrandPrizeAmount || largestGrandPrizePoolId === '') {
        largestGrandPrizePoolId = id
        largestGrandPrizeAmount = prizeAmount
      }
    }

    return largestGrandPrizePoolId
  }, [allPrizeInfo])

  const prizePool = prizePools.find((pool) => pool.id === prizePoolId)

  const { data: tokenWithPrice, isFetched: isFetchedTokenPrice } = usePrizeTokenPrice(
    prizePool as PrizePool
  )

  const isFetched = isFetchedAllPrizeInfo && isFetchedTokenPrice

  const data =
    !!prizePool && !!tokenWithPrice
      ? {
          prizePool: prizePool,
          token: { ...tokenWithPrice, amount: largestGrandPrizeAmount }
        }
      : undefined

  return { data, isFetched }
}
