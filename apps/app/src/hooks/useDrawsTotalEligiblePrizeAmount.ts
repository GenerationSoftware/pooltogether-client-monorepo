import {
  useAllPrizeDrawWinners,
  useAllPrizeTokenPrices,
  useAllUserEligibleDraws,
  useLastCheckedPrizesTimestamps
} from '@generationsoftware/hyperstructure-react-hooks'
import { useMemo } from 'react'
import { Address, formatUnits, parseEther } from 'viem'
import { useSupportedPrizePools } from './useSupportedPrizePools'

/**
 * Returns the total prize amount in eligible and unchecked draws (in ETH)
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

  const { data: prizeTokens, isFetched: isFetchedPrizeTokens } =
    useAllPrizeTokenPrices(prizePoolsArray)

  const totalAmount = useMemo(() => {
    if (!!lastCheckedPrizesTimestamps && !!allUserEligibleDraws && !!allDrawWinners) {
      let totalValue = 0

      for (const chainId in allUserEligibleDraws.eligibleDraws) {
        const prizePoolId = prizePoolsArray.find((pool) => pool.chainId === Number(chainId))?.id
        const prizeToken = !!prizePoolId ? prizeTokens[prizePoolId] : undefined

        if (!!prizeToken) {
          const eligibleDrawIds = allUserEligibleDraws.eligibleDraws[chainId].map((d) => d.id)
          const lastCheckedPrizesTimestamp = lastCheckedPrizesTimestamps[chainId] ?? 0

          allDrawWinners[chainId]?.forEach((draw) => {
            if (!!draw.prizeClaims.length) {
              const lastClaimTimestamp = draw.prizeClaims[draw.prizeClaims.length - 1].timestamp
              if (
                lastClaimTimestamp > lastCheckedPrizesTimestamp &&
                eligibleDrawIds.includes(draw.id)
              ) {
                if (options?.hideAlreadyCheckedPrizes) {
                  totalValue +=
                    parseFloat(
                      formatUnits(
                        draw.prizeClaims.reduce(
                          (a, b) => a + (b.timestamp > lastCheckedPrizesTimestamp ? b.payout : 0n),
                          0n
                        ),
                        prizeToken.decimals
                      )
                    ) * (prizeToken.price ?? 0)
                } else {
                  totalValue +=
                    parseFloat(
                      formatUnits(
                        draw.prizeClaims.reduce((a, b) => a + b.payout, 0n),
                        prizeToken.decimals
                      )
                    ) * (prizeToken.price ?? 0)
                }
              }
            }
          })
        }
      }

      return parseEther(totalValue.toString())
    }
  }, [lastCheckedPrizesTimestamps, userAddress, allUserEligibleDraws, allDrawWinners, prizeTokens])

  const isFetched =
    isFetchedAllUserEligibleDraws &&
    isFetchedAllDrawWinners &&
    isFetchedPrizeTokens &&
    !!totalAmount

  return { data: totalAmount, isFetched }
}
