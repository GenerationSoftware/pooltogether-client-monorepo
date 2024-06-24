import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { formatUnits } from 'viem'
import { QUERY_KEYS } from '../constants'
import { useAllPrizeTokenPrices } from './useAllPrizeTokenPrices'

/**
 * Returns total prize value for all given prize pools
 * @param prizePools instances of `PrizePool` to query total prize value for
 * @returns
 */
export const useAllPrizeValue = (prizePools: PrizePool[]) => {
  const {
    data: prizeTokens,
    isFetched: isFetchedPrizeTokens,
    refetch: refetchAllPrizeTokenPrices
  } = useAllPrizeTokenPrices(prizePools)

  const results = useQueries({
    queries: prizePools.map((prizePool) => {
      const queryKey = [QUERY_KEYS.totalPrizesAvailable, prizePool?.id]

      return {
        queryKey: queryKey,
        queryFn: async () => await prizePool.getTotalPrizesAvailable(),
        enabled: !!prizePool,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched = isFetchedPrizeTokens && results?.every((result) => result.isFetched)
    const refetch = () => {
      refetchAllPrizeTokenPrices()
      results?.forEach((result) => result.refetch())
    }

    const formattedData: { [prizePoolId: string]: number } = {}
    results.forEach((result, i) => {
      const prizePoolId = prizePools[i].id
      const prizeToken = prizeTokens[prizePoolId]

      if (!!prizeToken?.price && !!result.data) {
        formattedData[prizePoolId] =
          parseFloat(formatUnits(result.data, prizeToken.decimals)) * prizeToken.price
      }
    })
    return { isFetched, refetch, data: formattedData }
  }, [prizeTokens, isFetchedPrizeTokens, results])
}
