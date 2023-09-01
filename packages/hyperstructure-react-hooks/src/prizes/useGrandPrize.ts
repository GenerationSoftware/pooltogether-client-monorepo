import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { TokenWithAmount } from '@shared/types'
import { useMemo } from 'react'
import { useAllPrizeInfo, usePrizeTokenData } from '..'

/**
 * Returns the prize pool's grand prize
 *
 * Wraps {@link useAllPrizeInfo}
 * @param prizePool instance of `PrizePool` to check
 * @param options optional settings
 * @returns
 */
export const useGrandPrize = (
  prizePool: PrizePool,
  options?: { useCurrentPrizeSizes?: boolean }
): {
  data?: TokenWithAmount
  isFetched: boolean
} => {
  const { data: allPrizeInfo, isFetched: isFetchedAllPrizeInfo } = useAllPrizeInfo([prizePool])

  const { data: prizeToken, isFetched: isFetchedPrizeToken } = usePrizeTokenData(prizePool)

  const isFetched = isFetchedAllPrizeInfo && isFetchedPrizeToken

  const data = useMemo(() => {
    if (isFetched && !!allPrizeInfo?.[prizePool.id] && !!prizeToken) {
      const grandPrizeAmount = allPrizeInfo[prizePool.id][0].amount
      return {
        ...prizeToken,
        amount: options?.useCurrentPrizeSizes
          ? grandPrizeAmount.current
          : grandPrizeAmount.estimated
      }
    } else {
      return undefined
    }
  }, [allPrizeInfo, prizeToken])

  return { data, isFetched }
}
