import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAllUserEligibleDraws, useLastCheckedPrizesTimestamps } from '..'

/**
 * Returns info on draws to check for prizes based on eligibility and last checked timestamps
 * @param prizePools instances of `PrizePool`
 * @param userAddress a user's address to find draws for
 * @returns
 */
export const useDrawsToCheckForPrizes = (prizePools: PrizePool[], userAddress: Address) => {
  const { lastCheckedPrizesTimestamps } = useLastCheckedPrizesTimestamps(userAddress)

  const { data: allUserEligibleDraws, isFetched: isFetchedAllUserEligibleDraws } =
    useAllUserEligibleDraws(prizePools, userAddress)

  const drawsToCheck = useMemo(() => {
    if (!!lastCheckedPrizesTimestamps && !!allUserEligibleDraws) {
      const draws: { [chainId: number]: { id: number; firstClaim: number; lastClaim: number }[] } =
        {}

      let totalCount = 0
      let startTimestamp = Number.MAX_SAFE_INTEGER
      let endTimestamp = 0

      for (const chainId in allUserEligibleDraws.eligibleDraws) {
        const chainDraws: { id: number; firstClaim: number; lastClaim: number }[] = []

        const eligibleDraws = allUserEligibleDraws.eligibleDraws[chainId]
        const lastCheckedPrizesTimestamp = lastCheckedPrizesTimestamps[chainId] ?? 0

        eligibleDraws.forEach((draw) => {
          if (draw.lastClaim > lastCheckedPrizesTimestamp) {
            chainDraws.push(draw)
          }
        })

        const sortedDraws = chainDraws.sort((a, b) => a.firstClaim - b.firstClaim)

        if (sortedDraws.length > 0) {
          const firstClaimTimestamp = sortedDraws[0].firstClaim
          const lastClaimTimestamp = sortedDraws[sortedDraws.length - 1].lastClaim

          totalCount += sortedDraws.length

          if (startTimestamp > firstClaimTimestamp) {
            startTimestamp = firstClaimTimestamp
          }

          if (endTimestamp < lastClaimTimestamp) {
            endTimestamp = lastClaimTimestamp
          }
        }

        draws[chainId] = sortedDraws
      }

      return { draws, totalCount, timestamps: { start: startTimestamp, end: endTimestamp } }
    }
  }, [lastCheckedPrizesTimestamps, userAddress, allUserEligibleDraws])

  const isFetched = isFetchedAllUserEligibleDraws && !!drawsToCheck

  return { data: drawsToCheck, isFetched }
}
