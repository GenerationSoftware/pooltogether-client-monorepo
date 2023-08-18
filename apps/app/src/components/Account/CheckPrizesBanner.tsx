import { usePrizeTokenPrice } from '@pooltogether/hyperstructure-react-hooks'
import { TokenValue } from '@shared/react-components'
import { Button, Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useDrawsToCheckForPrizes } from '@hooks/useDrawsToCheckForPrizes'
import { useDrawsTotalEligiblePrizeAmount } from '@hooks/useDrawsTotalEligiblePrizeAmount'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'

interface CheckPrizesBannerProps {
  className?: string
}

// TODO: mobile design
// TODO: localization
export const CheckPrizesBanner = (props: CheckPrizesBannerProps) => {
  const { className } = props

  const { address: userAddress } = useAccount()

  // TODO: this assumes every prize pool is using the same prize token - not ideal
  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)
  const { data: prizeToken } = usePrizeTokenPrice(prizePoolsArray[0])

  // const { data: drawsToCheck } = useDrawsToCheckForPrizes(userAddress as Address)
  const { data: drawsToCheck } = useDrawsToCheckForPrizes(
    '0x062bdedfecfd229cd908371a5683e23224366856'
  )

  // const { data: totalPrizeAmount } = useDrawsTotalEligiblePrizeAmount(userAddress as Address)
  const { data: totalPrizeAmount } = useDrawsTotalEligiblePrizeAmount(
    '0x062bdedfecfd229cd908371a5683e23224366856'
  )

  if (!!drawsToCheck && !!totalPrizeAmount) {
    return (
      <div
        className={classNames(
          'relative w-full flex items-center justify-between px-8 py-6 text-pt-purple-300 bg-pt-purple-700 font-medium rounded-md',
          className
        )}
      >
        <div className='flex flex-col'>
          <span>You were eligible for {drawsToCheck.totalCount} draws</span>
          {!!drawsToCheck && <DateRange timestamps={drawsToCheck.timestamps} />}
        </div>
        <div className='absolute inset-0 flex gap-2 items-center justify-center'>
          <span>Totalling</span>
          {!!prizeToken ? (
            <span className='text-5xl text-pt-teal'>
              <TokenValue token={{ ...prizeToken, amount: totalPrizeAmount }} hideZeroes={true} />
            </span>
          ) : (
            <Spinner />
          )}
          <span>in Prizes</span>
        </div>
        {/* TODO: open prize checking modal onclick */}
        <Button onClick={() => {}}>Check for Prizes</Button>
      </div>
    )
  }
}

interface DateRangeProps {
  timestamps: { start: number; end: number }
  className?: string
}

const DateRange = (props: DateRangeProps) => {
  const { timestamps, className } = props

  const dateFormatting: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  }

  const dates = useMemo(() => {
    return {
      start: new Date(timestamps.start * 1e3).toLocaleDateString(undefined, dateFormatting),
      end: new Date(timestamps.end * 1e3).toLocaleDateString(undefined, dateFormatting)
    }
  }, [timestamps])

  return (
    <span className={className}>
      {dates.start === dates.end ? dates.start : `${dates.start} - ${dates.end}`}
    </span>
  )
}
