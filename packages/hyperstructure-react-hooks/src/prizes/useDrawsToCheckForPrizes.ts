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

  const { data: allLastWinners, isFetched: isFetchedAllLastWinners } = useAllLastPrizeDrawWinners(
    prizePools,
    { onlyLastDraw: true }
  )

  const drawsToCheck = useMemo(() => {
    if (!!allUserEligibleDraws && !!Object.keys(allLastWinners).length) {
      const draws: { [chainId: number]: DrawWithTimestamps[] } = {}

      let totalCount = 0
      let startTimestamp = Number.MAX_SAFE_INTEGER
      let endTimestamp = 0

      for (const chainId in allUserEligibleDraws.eligibleDraws) {
        const lastWinningDraw = allLastWinners[chainId]?.[0]

        if (!!lastWinningDraw?.prizeClaims[0]) {
          const chainDraws: DrawWithTimestamps[] = []

          const eligibleDraws = allUserEligibleDraws.eligibleDraws[chainId]
          const lastCheckedPrizesTimestamp = lastCheckedPrizesTimestamps[chainId] ?? 0

          eligibleDraws.forEach((draw) => {
            if (
              draw.finalizedAt > lastCheckedPrizesTimestamp &&
              (draw.id < lastWinningDraw.id ||
                (draw.id === lastWinningDraw.id &&
                  lastWinningDraw.prizeClaims[0].timestamp > lastCheckedPrizesTimestamp))
            ) {
              chainDraws.push(draw)
            }
          })

          const sortedDraws = chainDraws.sort((a, b) => a.id - b.id)

          if (sortedDraws.length > 0) {
            const startDrawClosedAt = sortedDraws[0].closedAt
            const endDrawClosedAt = sortedDraws.at(-1)!.closedAt

            totalCount += sortedDraws.length

            if (startTimestamp > startDrawClosedAt) {
              startTimestamp = startDrawClosedAt
            }

            if (endTimestamp < endDrawClosedAt) {
              endTimestamp = endDrawClosedAt
            }
          }

          draws[chainId] = sortedDraws
        }
      }

      if (endTimestamp === 0) {
        startTimestamp = 0
      }

      return { draws, totalCount, timestamps: { start: startTimestamp, end: endTimestamp } }
    }
  }, [lastCheckedPrizesTimestamps, allUserEligibleDraws, allLastWinners])

  const isFetched = isFetchedAllUserEligibleDraws && isFetchedAllLastWinners && !!drawsToCheck

  return { data: drawsToCheck, isFetched }
}
