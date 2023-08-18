import { getUserBalanceUpdates, PrizePool } from '@pooltogether/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address } from 'viem'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a user's history of balance updates
 * @param prizePools instances of `PrizePool`
 * @param userAddress a user's address to get balance updates for
 * @returns
 */
export const useAllUserBalanceUpdates = (prizePools: PrizePool[], userAddress: string) => {
  const results = useQueries({
    queries: prizePools.map((prizePool) => {
      return {
        queryKey: [QUERY_KEYS.userBalanceUpdates, prizePool?.chainId, userAddress],
        queryFn: async () => {
          const chainId = prizePool.chainId
          const balanceUpdates = await getUserBalanceUpdates(chainId, userAddress)
          return balanceUpdates
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

    const formattedData: {
      [chainId: number]: {
        [vaultAddress: Address]: { balance: bigint; delegateBalance: bigint; timestamp: number }[]
      }
    } = {}
    results.forEach((result, i) => {
      if (!!result.data) {
        formattedData[prizePools[i].chainId] = result.data
      }
    })

    return { isFetched, refetch, data: formattedData }
  }, [results])
}
