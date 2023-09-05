import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAllUserEligibleDraws, useLastCheckedPrizesTimestamps } from '..'

/**
 * Returns info on draws to check for prizes based on eligibility and last checked draw IDs
 * @param prizePools instances of `PrizePool`
 * @param userAddress a user's address to find draws for
 * @returns
 */
export const useDrawsToCheckForPrizes = (prizePools: PrizePool[], userAddress: Address) => {
  const { lastCheckedPrizesTimestamps } = useLastCheckedPrizesTimestamps()

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
        const lastCheckedPrizesTimestamp =
          lastCheckedPrizesTimestamps[userAddress.toLowerCase()]?.[chainId] ?? 0

        eligibleDraws.forEach((draw) => {
          if (draw.lastClaim > lastCheckedPrizesTimestamp) {
            chainDraws.push(draw)
          }
        })

        const sortedDraws = chainDraws.sort((a, b) => a.firstClaim - b.firstClaim)

        if (chainDraws.length > 0) {
          totalCount += chainDraws.length
          if (startTimestamp > sortedDraws[0].firstClaim) {
            startTimestamp = sortedDraws[0].firstClaim
          }
          if (endTimestamp < sortedDraws[sortedDraws.length - 1].lastClaim) {
            endTimestamp = sortedDraws[sortedDraws.length - 1].lastClaim
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
