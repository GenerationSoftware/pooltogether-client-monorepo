import {
  useAllPrizeTokenPrices,
  useAllUserPrizePoolWins,
  useLastCheckedPrizesTimestamps
} from '@generationsoftware/hyperstructure-react-hooks'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import { useSupportedPrizePools } from './useSupportedPrizePools'

/**
 * Returns a user's total prize winnings (in ETH)
 * @param userAddress user address to get total winnings for
 * @param options optional settings
 * @returns
 */
export const useUserTotalWinnings = (
  userAddress: Address,
  options?: { skipPrizeChecking?: boolean }
) => {
  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const {
    data: wins,
    isFetched: isFetchedWins,
    refetch: refetchWins
  } = useAllUserPrizePoolWins(prizePoolsArray, userAddress)

  const { data: prizeTokens, isFetched: isFetchedPrizeTokens } =
    useAllPrizeTokenPrices(prizePoolsArray)

  const { lastCheckedPrizesTimestamps } = useLastCheckedPrizesTimestamps(userAddress)

  const totalTokensWonByChain = useMemo(() => {
    if (!!wins && !!lastCheckedPrizesTimestamps) {
      const totals: { [chainId: number]: bigint } = {}
      for (const key in wins) {
        const chainId = parseInt(key)
        const lastCheckedPrizesTimestamp = lastCheckedPrizesTimestamps[chainId] ?? 0

        let chainTotal = 0n

        wins[chainId].forEach((win) => {
          if (win.timestamp <= lastCheckedPrizesTimestamp || options?.skipPrizeChecking) {
            chainTotal += BigInt(win.payout)
          }
        })

        totals[chainId] = chainTotal
      }
      return totals
    }
  }, [wins, lastCheckedPrizesTimestamps, userAddress, options])

  return useMemo(() => {
    const isFetched = isFetchedWins && isFetchedPrizeTokens && !!totalTokensWonByChain

    let totalWinnings = 0

    if (isFetched) {
      for (const key in totalTokensWonByChain) {
        const chainId = parseInt(key)
        const prizePoolId = prizePoolsArray.find((pool) => pool.chainId === chainId)?.id
        const prizeToken = !!prizePoolId ? prizeTokens[prizePoolId] : undefined

        if (!!prizeToken) {
          const tokenAmount = parseFloat(
            formatUnits(totalTokensWonByChain[chainId], prizeToken.decimals)
          )
          totalWinnings += tokenAmount * (prizeToken.price ?? 0)
        }
      }
    }

    return { isFetched, refetch: refetchWins, data: isFetched ? totalWinnings : undefined }
  }, [totalTokensWonByChain, prizeTokens])
}
