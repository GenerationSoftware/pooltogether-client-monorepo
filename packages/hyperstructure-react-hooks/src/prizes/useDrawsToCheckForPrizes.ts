import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { DrawWithTimestamps } from '@shared/types'
import { useMemo } from 'react'
import { Address } from 'viem'
import {
  useAllLastPrizeDrawWinners,
  useAllUserEligibleDraws,
  useLastCheckedPrizesTimestamps
} from '..'

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

  const { data: allLastWinners, isFetched: isFetchedAllLastWinners } =
    useAllLastPrizeDrawWinners(prizePools)

  const drawsToCheck = useMemo(() => {
    if (!!allUserEligibleDraws && !!Object.keys(allLastWinners).length) {
      const draws: { [chainId: number]: DrawWithTimestamps[] } = {}

      let totalCount = 0
      let startTimestamp = Number.MAX_SAFE_INTEGER
      let endTimestamp = 0

      for (const chainId in allUserEligibleDraws.eligibleDraws) {
        const chainDraws: DrawWithTimestamps[] = []

        const chainLastDrawWinners = allLastWinners[chainId]
        const eligibleDraws = allUserEligibleDraws.eligibleDraws[chainId]
        const lastCheckedPrizesTimestamp = lastCheckedPrizesTimestamps[chainId] ?? 0

        if (!!chainLastDrawWinners) {
          eligibleDraws.forEach((draw) => {
            const drawWinners = chainLastDrawWinners.find((d) => d.id === draw.id)
            if (!!drawWinners && !!drawWinners.prizeClaims.length) {
              const lastClaim = drawWinners.prizeClaims[drawWinners.prizeClaims.length - 1]
              if (lastClaim.timestamp > lastCheckedPrizesTimestamp) {
                chainDraws.push(draw)
              }
            }
          })
        }

        const sortedDraws = chainDraws.sort((a, b) => a.id - b.id)

        if (sortedDraws.length > 0) {
          const firstDraw = chainLastDrawWinners.find((d) => d.id === sortedDraws[0].id)!
          const lastDraw = chainLastDrawWinners.find(
            (d) => d.id === sortedDraws[sortedDraws.length - 1].id
          )!

          const firstClaimToCheck = firstDraw.prizeClaims.find(
            (claim) => claim.timestamp > lastCheckedPrizesTimestamp
          )!
          const lastClaimToCheck = lastDraw.prizeClaims[lastDraw.prizeClaims.length - 1]

          totalCount += sortedDraws.length

          if (startTimestamp > firstClaimToCheck.timestamp) {
            startTimestamp = firstClaimToCheck.timestamp
          }

          if (endTimestamp < lastClaimToCheck.timestamp) {
            endTimestamp = lastClaimToCheck.timestamp
          }
        }

        draws[chainId] = sortedDraws
      }

      return { draws, totalCount, timestamps: { start: startTimestamp, end: endTimestamp } }
    }
  }, [userAddress, lastCheckedPrizesTimestamps, allUserEligibleDraws, allLastWinners])

  const isFetched = isFetchedAllUserEligibleDraws && isFetchedAllLastWinners && !!drawsToCheck

  return { data: drawsToCheck, isFetched }
}
