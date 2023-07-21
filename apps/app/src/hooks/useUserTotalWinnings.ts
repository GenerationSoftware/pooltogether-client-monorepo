import {
  NO_REFETCH,
  QUERY_KEYS,
  useAllUserPrizePoolWins,
  useAllVaultTokenPrices
} from '@pooltogether/hyperstructure-react-hooks'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import { useSupportedPrizePools } from './useSupportedPrizePools'

/**
 * Returns a user's total prize winnings in ETH
 * @returns
 */
export const useUserTotalWinnings = () => {
  const { address: userAddress } = useAccount()

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const {
    data: wins,
    isFetched: isFetchedWins,
    refetch: refetchWins
  } = useAllUserPrizePoolWins(prizePoolsArray, userAddress as Address)

  const { data: allVaultTokenPrices, isFetched: isFetchedAllVaultTokenPrices } =
    useAllVaultTokenPrices()

  const totalTokensWonByChain = useMemo(() => {
    if (!!wins) {
      const totals: { [chainId: number]: bigint } = {}
      for (const key in wins) {
        const chainId = parseInt(key)
        totals[chainId] = wins[chainId].reduce((a, b) => a + BigInt(b.payout), 0n)
      }
      return totals
    }
  }, [wins])

  const tokenDataResults = useQueries({
    queries: prizePoolsArray.map((prizePool) => {
      return {
        queryKey: [QUERY_KEYS.prizeTokenData, prizePool?.id],
        queryFn: async () => await prizePool.getPrizeTokenData(),
        staleTime: Infinity,
        enabled: !!prizePool,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched =
      isFetchedWins &&
      isFetchedAllVaultTokenPrices &&
      tokenDataResults?.every((result) => result.isFetched) &&
      !!wins &&
      !!allVaultTokenPrices &&
      !!totalTokensWonByChain

    let totalWinnings = 0

    if (isFetched) {
      for (const key in totalTokensWonByChain) {
        const chainId = parseInt(key)
        const tokenDataResult = tokenDataResults.find((result) => result.data?.chainId === chainId)
        if (!!tokenDataResult?.data) {
          const tokenData = tokenDataResult.data
          const tokenAmount = parseFloat(
            formatUnits(totalTokensWonByChain[chainId], tokenData.decimals)
          )
          const tokenPrice = allVaultTokenPrices[chainId]?.[tokenData.address] ?? 0
          totalWinnings += tokenAmount * tokenPrice
        }
      }
    }

    return { isFetched, refetch: refetchWins, data: isFetched ? totalWinnings : undefined }
  }, [totalTokensWonByChain, tokenDataResults])
}
