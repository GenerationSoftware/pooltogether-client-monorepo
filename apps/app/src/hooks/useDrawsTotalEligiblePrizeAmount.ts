import {
  useAllPrizeDrawWinners,
  useAllUserEligibleDraws,
  useLastCheckedPrizesTimestamps
} from '@generationsoftware/hyperstructure-react-hooks'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useSupportedPrizePools } from './useSupportedPrizePools'

/**
 * Returns the total prize amount in eligible and unchecked draws
 * @param userAddress a user's address to find relevant draws for
 * @param options optional settings
 * @returns
 */
export const useDrawsTotalEligiblePrizeAmount = (
  userAddress: Address,
  options?: { hideAlreadyCheckedPrizes?: boolean }
) => {
  const { lastCheckedPrizesTimestamps } = useLastCheckedPrizesTimestamps(userAddress)

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const { data: allUserEligibleDraws, isFetched: isFetchedAllUserEligibleDraws } =
    useAllUserEligibleDraws(prizePoolsArray, userAddress)

  const { data: allDrawWinners, isFetched: isFetchedAllDrawWinners } =
    useAllPrizeDrawWinners(prizePoolsArray)

  const totalAmount = useMemo(() => {
    if (!!lastCheckedPrizesTimestamps && !!allUserEligibleDraws && !!allDrawWinners) {
      let total = 0n

      for (const chainId in allUserEligibleDraws.eligibleDraws) {
        const eligibleDrawIds = allUserEligibleDraws.eligibleDraws[chainId].map((d) => d.id)
        const lastCheckedPrizesTimestamp = lastCheckedPrizesTimestamps[chainId] ?? 0

        allDrawWinners[chainId]?.forEach((draw) => {
          const lastClaimTimestamp = draw.prizeClaims[draw.prizeClaims.length - 1].timestamp
          if (
            lastClaimTimestamp > lastCheckedPrizesTimestamp &&
            eligibleDrawIds.includes(draw.id)
          ) {
            if (options?.hideAlreadyCheckedPrizes) {
              total += draw.prizeClaims.reduce(
                (a, b) => a + (b.timestamp > lastCheckedPrizesTimestamp ? b.payout : 0n),
                0n
              )
            } else {
              total += draw.prizeClaims.reduce((a, b) => a + b.payout, 0n)
            }
          }
        })
      }

      return total
    }
  }, [lastCheckedPrizesTimestamps, userAddress, allUserEligibleDraws, allDrawWinners])

  const isFetched = isFetchedAllUserEligibleDraws && isFetchedAllDrawWinners && !!totalAmount

  return { data: totalAmount, isFetched }
}
