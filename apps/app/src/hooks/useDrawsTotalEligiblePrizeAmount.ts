import {
  useAllPrizeDrawWinners,
  useAllUserEligibleDraws,
  useLastCheckedDrawIds
} from '@pooltogether/hyperstructure-react-hooks'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useSupportedPrizePools } from './useSupportedPrizePools'

/**
 * Returns the total prize amount in eligible and unchecked draws
 * @param userAddress a user's address to find relevant draws for
 * @returns
 */
export const useDrawsTotalEligiblePrizeAmount = (userAddress: Address) => {
  const { lastCheckedDrawIds } = useLastCheckedDrawIds()

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const { data: allUserEligibleDraws, isFetched: isFetchedAllUserEligibleDraws } =
    useAllUserEligibleDraws(prizePoolsArray, userAddress)

  const { data: allDrawWinners, isFetched: isFetchedAllDrawWinners } =
    useAllPrizeDrawWinners(prizePoolsArray)

  const totalAmount = useMemo(() => {
    if (!!lastCheckedDrawIds && !!allUserEligibleDraws && !!allDrawWinners) {
      let total = 0n

      for (const chainId in allUserEligibleDraws.eligibleDraws) {
        const eligibleDrawIds = allUserEligibleDraws.eligibleDraws[chainId].map((d) => d.id)
        const lastCheckedDrawId = lastCheckedDrawIds[chainId] ?? 0

        allDrawWinners[chainId]?.forEach((draw) => {
          const drawId = parseInt(draw.id)
          if (drawId > lastCheckedDrawId && eligibleDrawIds.includes(drawId)) {
            total += draw.prizeClaims.reduce((a, b) => a + BigInt(b.payout), 0n)
          }
        })
      }

      return total
    }
  }, [lastCheckedDrawIds, allUserEligibleDraws, allDrawWinners])

  const isFetched = isFetchedAllUserEligibleDraws && isFetchedAllDrawWinners && !!totalAmount

  return { data: totalAmount, isFetched }
}
