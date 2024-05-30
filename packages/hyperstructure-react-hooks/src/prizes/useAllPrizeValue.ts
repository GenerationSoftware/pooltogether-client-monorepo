import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useMemo } from 'react'
import { formatUnits } from 'viem'
import { useAllPrizeInfo } from './useAllPrizeInfo'
import { useAllPrizeTokenPrices } from './useAllPrizeTokenPrices'

/**
 * Returns total prize value for all given prize pools
 * @param prizePools instances of `PrizePool` to query total prize value for
 * @returns
 */
export const useAllPrizeValue = (prizePools: PrizePool[]) => {
  const {
    data: allPrizeInfo,
    isFetched: isFetchedAllPrizeInfo,
    refetch: refetchAllPrizeInfo
  } = useAllPrizeInfo(prizePools)

  const {
    data: prizeTokens,
    isFetched: isFetchedPrizeTokens,
    refetch: refetchAllPrizeTokenPrices
  } = useAllPrizeTokenPrices(prizePools)

  const isFetched = isFetchedAllPrizeInfo && isFetchedPrizeTokens

  const refetch = () => {
    refetchAllPrizeInfo()
    refetchAllPrizeTokenPrices()
  }

  const data = useMemo(() => {
    const totalPrizeValue: { [prizePoolId: string]: number } = {}

    if (isFetched) {
      const prizePoolIds = prizePools.map((pool) => pool.id)
      prizePoolIds.forEach((prizePoolId) => {
        let totalValue = 0

        const prizes = allPrizeInfo[prizePoolId]
        const prizeToken = prizeTokens[prizePoolId]

        if (!!prizes?.length && !!prizeToken?.price) {
          prizes.slice(0, prizes.length - 2).forEach((prize, i) => {
            const prizeValue =
              parseFloat(formatUnits(prize.amount.current, prizeToken.decimals)) *
              (prizeToken.price as number)
            totalValue += prizeValue * Math.pow(4, i)
          })
        }

        if (!!totalValue) {
          totalPrizeValue[prizePoolId] = totalValue
        }
      })
    }

    return totalPrizeValue
  }, [allPrizeInfo, prizeTokens, isFetched])

  return { data, isFetched, refetch }
}
