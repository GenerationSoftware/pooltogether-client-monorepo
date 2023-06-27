import {
  getUserPrizePoolHistoricalWins,
  PrizePool,
  SubgraphPrizePoolAccount
} from '@pooltogether/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a user's past wins on any given prize pools
 * @param prizePools instances of `PrizePool`
 * @param userAddress a user's address to check wins for
 * @returns
 */
export const useAllUserPrizePoolWins = (prizePools: PrizePool[], userAddress: string) => {
  const results = useQueries({
    queries: prizePools.map((prizePool) => {
      return {
        queryKey: [QUERY_KEYS.userWins, prizePool?.chainId, userAddress],
        queryFn: async () => {
          const chainId = prizePool.chainId
          const wins = await getUserPrizePoolHistoricalWins(chainId, userAddress)
          return { chainId, wins }
        },
        staleTime: Infinity,
        enabled: !!prizePool && !!userAddress,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)
    const refetch = () => results?.forEach((result) => result.refetch())

    const formattedData: { [chainId: number]: SubgraphPrizePoolAccount['prizesReceived'] } = {}
    results.forEach((result) => {
      if (result.data) {
        formattedData[result.data.chainId] = result.data.wins
      }
    })

    return { isFetched, refetch, data: formattedData }
  }, [results])
}
