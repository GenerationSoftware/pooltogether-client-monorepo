import {
  useDrawsToCheckForPrizes,
  usePrizeTokenData
} from '@pooltogether/hyperstructure-react-hooks'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { TokenValue } from '@shared/react-components'
import { Button, Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useDrawsTotalEligiblePrizeAmount } from '@hooks/useDrawsTotalEligiblePrizeAmount'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'

interface CheckPrizesBannerProps {
  className?: string
}

// TODO: localization
export const CheckPrizesBanner = (props: CheckPrizesBannerProps) => {
  const { className } = props

  const { address: userAddress } = useAccount()

  const { setIsModalOpen } = useIsModalOpen(MODAL_KEYS.checkPrizes)

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  // TODO: this assumes every prize pool is using the same prize token - not ideal
  const { data: prizeToken } = usePrizeTokenData(prizePoolsArray[0])

  const { data: drawsToCheck } = useDrawsToCheckForPrizes(prizePoolsArray, userAddress as Address)

  const { data: totalPrizeAmount } = useDrawsTotalEligiblePrizeAmount(userAddress as Address)

  if (!!drawsToCheck && !!totalPrizeAmount) {
    return (
      <div
        className={classNames(
          'relative w-full flex flex-col gap-4 items-center justify-between px-8 py-6 text-pt-purple-300 bg-pt-purple-700 font-medium rounded-md isolate',
          'md:flex-row',
          className
        )}
      >
        <div className='flex flex-col text-center text-sm md:text-start lg:text-base'>
          <span>You were eligible for {drawsToCheck.totalCount} draws</span>
          {!!drawsToCheck && (
            <DateRange timestamps={drawsToCheck.timestamps} className='text-pt-purple-100' />
          )}
        </div>
        <div className='inset-0 flex flex-col gap-x-2 items-center justify-center text-sm -z-10 md:absolute md:flex-row lg:text-base'>
          <span>Totalling</span>
          {!!prizeToken ? (
            <span className='text-2xl md:text-3xl lg:text-5xl text-pt-teal'>
              <TokenValue token={{ ...prizeToken, amount: totalPrizeAmount }} hideZeroes={true} />
            </span>
          ) : (
            <Spinner />
          )}
          <span>in Prizes</span>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <span className='text-xs lg:text-sm'>Check for Prizes</span>
        </Button>
      </div>
    )
  }

  return <></>
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
