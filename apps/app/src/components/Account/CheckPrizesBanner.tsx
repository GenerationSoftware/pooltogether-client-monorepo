import {
  useAllPrizeDrawWinners,
  useAllUserEligibleDraws,
  useLastCheckedDrawIds,
  usePrizeTokenPrice
} from '@pooltogether/hyperstructure-react-hooks'
import { TokenValue } from '@shared/react-components'
import { Button } from '@shared/ui'
import classNames from 'classnames'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'

interface CheckPrizesBannerProps {
  className?: string
}

// TODO: this component is way too complicated - split it up into separate hooks
// TODO: center total prizes
// TODO: mobile design
// TODO: localization
export const CheckPrizesBanner = (props: CheckPrizesBannerProps) => {
  const { className } = props

  const { address: userAddress } = useAccount()

  const { lastCheckedDrawIds } = useLastCheckedDrawIds()

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  // const { data: allUserEligibleDraws } = useAllUserEligibleDraws(
  //   prizePoolsArray,
  //   userAddress as Address
  // )
  const { data: allUserEligibleDraws } = useAllUserEligibleDraws(
    prizePoolsArray,
    '0x062bdedfecfd229cd908371a5683e23224366856'
  )

  const { data: allDrawWinners } = useAllPrizeDrawWinners(prizePoolsArray)

  // TODO: this assumes every prize pool is using the same prize token - not ideal
  const { data: prizeToken } = usePrizeTokenPrice(prizePoolsArray[0])

  const numDrawsToCheck = useMemo(() => {
    if (!!lastCheckedDrawIds && !!allUserEligibleDraws) {
      let num = 0

      for (const chainId in allUserEligibleDraws.eligibleDraws) {
        const eligibleDraws = allUserEligibleDraws.eligibleDraws[chainId]
        const lastCheckedDrawId = lastCheckedDrawIds[chainId] ?? 0
        eligibleDraws.forEach((draw) => {
          if (draw.id > lastCheckedDrawId) {
            num++
          }
        })
      }

      return num
    }
  }, [lastCheckedDrawIds, allUserEligibleDraws])

  const dateFormatting: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  }

  const dateRangeToCheck = useMemo(() => {
    if (!!lastCheckedDrawIds && !!allUserEligibleDraws) {
      let startTimestamp = Number.MAX_SAFE_INTEGER
      let endTimestamp = 0

      for (const chainId in allUserEligibleDraws.eligibleDraws) {
        const eligibleDraws = allUserEligibleDraws.eligibleDraws[chainId]
        const lastCheckedDrawId = lastCheckedDrawIds[chainId] ?? 0

        eligibleDraws.forEach((draw) => {
          if (draw.id > lastCheckedDrawId) {
            if (startTimestamp > draw.timestamp) {
              startTimestamp = draw.timestamp
            }
            if (endTimestamp < draw.timestamp) {
              endTimestamp = draw.timestamp
            }
          }
        })
      }

      if (!!startTimestamp && !!endTimestamp) {
        return {
          startDate: new Date(startTimestamp * 1e3).toLocaleDateString(undefined, dateFormatting),
          endDate: new Date(endTimestamp * 1e3).toLocaleDateString(undefined, dateFormatting)
        }
      }
    }
  }, [lastCheckedDrawIds, allUserEligibleDraws])

  const totalPrizesAmount = useMemo(() => {
    if (!!lastCheckedDrawIds && !!allUserEligibleDraws && !!allDrawWinners && !!prizeToken) {
      let total = 0n

      for (const chainId in allUserEligibleDraws.eligibleDraws) {
        const eligibleDrawIds = allUserEligibleDraws.eligibleDraws[chainId].map((d) => d.id)
        const lastCheckedDrawId = lastCheckedDrawIds[chainId] ?? 0

        allDrawWinners[chainId].forEach((draw) => {
          const drawId = parseInt(draw.id)
          if (drawId > lastCheckedDrawId && eligibleDrawIds.includes(drawId)) {
            total += draw.prizeClaims.reduce((a, b) => a + BigInt(b.payout), 0n)
          }
        })
      }

      return total
    }
  }, [lastCheckedDrawIds, allUserEligibleDraws, allDrawWinners, prizeToken])

  if (!!numDrawsToCheck && !!prizeToken && !!totalPrizesAmount) {
    return (
      <div
        className={classNames(
          'w-full flex items-center justify-between px-8 py-6 text-pt-purple-300 bg-pt-purple-700 font-medium rounded-md',
          className
        )}
      >
        <div className='flex flex-col'>
          <span>You were eligible for {numDrawsToCheck} draws</span>
          {!!dateRangeToCheck && (
            <span>
              {dateRangeToCheck.startDate === dateRangeToCheck.endDate
                ? dateRangeToCheck.startDate
                : `${dateRangeToCheck.startDate} - ${dateRangeToCheck.endDate}`}
            </span>
          )}
        </div>
        <div className='flex gap-2 items-center'>
          <span>Totalling</span>
          <span className='text-5xl text-pt-teal'>
            <TokenValue token={{ ...prizeToken, amount: totalPrizesAmount }} hideZeroes={true} />
          </span>
          <span>in Prizes</span>
        </div>
        {/* TODO: open prize checking modal onclick */}
        <Button onClick={() => {}}>Check for Prizes</Button>
      </div>
    )
  }
}
