import {
  useAllUserEligibleDraws,
  useLastCheckedDrawIds
} from '@pooltogether/hyperstructure-react-hooks'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useSupportedPrizePools } from './useSupportedPrizePools'

/**
 * Returns info on draws to check for prizes based on eligibility and last checked draw IDs
 * @returns
 */
export const useDrawsToCheckForPrizes = (userAddress: Address) => {
  const { lastCheckedDrawIds } = useLastCheckedDrawIds()

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const { data: allUserEligibleDraws, isFetched: isFetchedAllUserEligibleDraws } =
    useAllUserEligibleDraws(prizePoolsArray, userAddress)

  const drawsToCheck = useMemo(() => {
    if (!!lastCheckedDrawIds && !!allUserEligibleDraws) {
      const draws: { [chainId: number]: { id: number; timestamp: number }[] } = {}

      let totalCount = 0
      let startTimestamp = Number.MAX_SAFE_INTEGER
      let endTimestamp = 0

      for (const chainId in allUserEligibleDraws.eligibleDraws) {
        const chainDraws: { id: number; timestamp: number }[] = []

        const eligibleDraws = allUserEligibleDraws.eligibleDraws[chainId]
        const lastCheckedDrawId = lastCheckedDrawIds[chainId] ?? 0

        eligibleDraws.forEach((draw) => {
          if (draw.id > lastCheckedDrawId) {
            chainDraws.push(draw)
          }
        })

        const sortedDraws = chainDraws.sort((a, b) => a.timestamp - b.timestamp)

        if (chainDraws.length > 0) {
          totalCount += chainDraws.length
          if (startTimestamp > sortedDraws[0].timestamp) {
            startTimestamp = sortedDraws[0].timestamp
          }
          if (endTimestamp < sortedDraws[sortedDraws.length - 1].timestamp) {
            endTimestamp = sortedDraws[sortedDraws.length - 1].timestamp
          }
        }

        draws[chainId] = sortedDraws
      }

      return { draws, totalCount, timestamps: { start: startTimestamp, end: endTimestamp } }
    }
  }, [lastCheckedDrawIds, allUserEligibleDraws])

  const isFetched = isFetchedAllUserEligibleDraws && !!drawsToCheck

  return { data: drawsToCheck, isFetched }
}
