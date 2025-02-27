import { useDrawsToCheckForPrizes } from '@generationsoftware/hyperstructure-react-hooks'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { Button, Spinner } from '@shared/ui'
import { getSimpleDate } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'

interface CheckPrizesBannerProps {
  className?: string
}

export const CheckPrizesBanner = (props: CheckPrizesBannerProps) => {
  const { className } = props

  const { address: userAddress } = useAccount()

  const { setIsModalOpen } = useIsModalOpen(MODAL_KEYS.checkPrizes)

  const t = useTranslations('Account.prizeChecking')

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const { data: drawsToCheck, isFetched: isFetchedDrawsToCheck } = useDrawsToCheckForPrizes(
    prizePoolsArray,
    userAddress!
  )

  if (!userAddress) {
    return <></>
  }

  return (
    <div
      className={classNames(
        'relative w-full flex flex-col gap-4 items-center justify-between px-8 py-6 text-pt-purple-300 bg-pt-purple-700 font-medium rounded-md isolate',
        'md:flex-row',
        className
      )}
    >
      <div className='flex flex-col text-center text-sm md:text-start lg:text-base'>
        {isFetchedDrawsToCheck ? (
          !!drawsToCheck?.totalCount ? (
            <>
              <span>{t('eligibleDraws', { number: drawsToCheck.totalCount })}</span>
              <DateRange timestamps={drawsToCheck.timestamps} className='text-pt-purple-100' />
            </>
          ) : (
            <>
              <span>{t('caughtUp')}</span>
              <span className='text-pt-purple-100'>{t('noNewDraws')}</span>
            </>
          )
        ) : (
          <>
            <span>{t('checkingEligibleDraws')}</span>
            <Spinner className='mx-auto mt-1 md:ml-0' />
          </>
        )}
      </div>
      <Button
        onClick={() => setIsModalOpen(true)}
        disabled={!isFetchedDrawsToCheck || !drawsToCheck?.totalCount}
      >
        <span className='text-xs lg:text-sm'>{t('checkPrizes')}</span>
      </Button>
    </div>
  )
}

interface DateRangeProps {
  timestamps: { start: number; end: number }
  className?: string
}

const DateRange = (props: DateRangeProps) => {
  const { timestamps, className } = props

  const dates = useMemo(() => {
    return {
      start: getSimpleDate(timestamps.start),
      end: getSimpleDate(timestamps.end)
    }
  }, [timestamps])

  return (
    <span className={className}>
      {dates.start === dates.end ? dates.start : `${dates.start} - ${dates.end}`}
    </span>
  )
}
