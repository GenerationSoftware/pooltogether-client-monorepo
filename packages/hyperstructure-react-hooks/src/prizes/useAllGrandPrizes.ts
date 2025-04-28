import { PrizePool, TokenWithAmount } from '@generationsoftware/hyperstructure-client-js'
import { useMemo } from 'react'
import { useAllPrizeInfo, useAllPrizeTokenData } from '..'

/**
 * Returns all grand prizes for all given prize pools
 *
 * Wraps {@link useAllPrizeInfo}
 * @param prizePools array of instances of the `PrizePool` class
 * @param options optional settings
 * @returns
 */
export const useAllGrandPrizes = (
  prizePools: PrizePool[],
  options?: { useCurrentPrizeSizes?: boolean }
) => {
  const { data: allPrizeInfo, isFetched: isFetchedAllPrizeInfo } = useAllPrizeInfo(prizePools)

  const { data: allPrizeTokens, isFetched: isFetchedAllPrizeTokens } =
    useAllPrizeTokenData(prizePools)

  const isFetched = isFetchedAllPrizeInfo && isFetchedAllPrizeTokens

  const data = useMemo(() => {
    if (isFetched) {
      const allGrandPrizes: { [prizePoolId: string]: TokenWithAmount } = {}

      prizePools.forEach((prizePool) => {
        const prizeInfo = allPrizeInfo[prizePool.id]
        const prizeToken = allPrizeTokens[prizePool.id]

        if (!!prizeInfo && !!prizeToken) {
          const grandPrizeAmount = prizeInfo[0].amount

          allGrandPrizes[prizePool.id] = {
            ...prizeToken,
            amount: options?.useCurrentPrizeSizes
              ? grandPrizeAmount.current
              : grandPrizeAmount.estimated
          }
        }
      })

      return allGrandPrizes
    }
  }, [allPrizeInfo, allPrizeTokens])

  return { data, isFetched }
}
