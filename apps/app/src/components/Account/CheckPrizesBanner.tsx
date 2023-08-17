import {
  useAllUserEligibleDraws,
  useLastCheckedDrawIds
} from '@pooltogether/hyperstructure-react-hooks'
import { CurrencyValue } from '@shared/react-components'
import { Button, Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'

interface CheckPrizesBannerProps {
  className?: string
}

// TODO: center total prizes
// TODO: mobile design
// TODO: localization
export const CheckPrizesBanner = (props: CheckPrizesBannerProps) => {
  const { className } = props

  const { address: userAddress } = useAccount()

  const { lastCheckedDrawIds } = useLastCheckedDrawIds()

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  // const { data: allUserEligibleDraws, isFetched: isFetchedAllUserEligibleDraws } =
  //   useAllUserEligibleDraws(prizePoolsArray, userAddress as Address)
  const { data: allUserEligibleDraws, isFetched: isFetchedAllUserEligibleDraws } =
    useAllUserEligibleDraws(prizePoolsArray, '0x062bdedfecfd229cd908371a5683e23224366856')

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

  // TODO: need to get total prize amount from all eligible draws
  const totalAvailablePrizeAmount = 5

  if (!!numDrawsToCheck) {
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
            <CurrencyValue
              baseValue={totalAvailablePrizeAmount}
              hideZeroes={true}
              fallback={<Spinner />}
            />
          </span>
          <span>in Prizes</span>
        </div>
        {/* TODO: open prize checking modal onclick */}
        <Button onClick={() => {}}>Check for Prizes</Button>
      </div>
    )
  }
}
