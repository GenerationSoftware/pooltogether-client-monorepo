import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useAllPrizeInfo,
  useDrawIds,
  useDrawPeriod,
  useFirstDrawOpenedAt,
  usePrizeTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { useCountdown } from '@shared/generic-react-hooks'
import { NetworkBadge, TokenAmount, TokenValue } from '@shared/react-components'
import { Card, Spinner } from '@shared/ui'
import { formatDailyCountToFrequency, getPrizeTextFromFrequency } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'

export interface PrizePoolPrizesCardProps {
  prizePool: PrizePool
  minPrizeRows?: number
  className?: string
  innerClassName?: string
  networkClassName?: string
  headersClassName?: string
  prizeClassName?: string
  frequencyClassName?: string
  drawsClassName?: string
  prevDrawClassName?: string
  currentDrawClassName?: string
}

export const PrizePoolPrizesCard = (props: PrizePoolPrizesCardProps) => {
  const {
    prizePool,
    minPrizeRows,
    className,
    innerClassName,
    networkClassName,
    headersClassName,
    prizeClassName,
    frequencyClassName,
    drawsClassName,
    prevDrawClassName,
    currentDrawClassName
  } = props

  const t_prizes = useTranslations('Prizes')
  const t_freq = useTranslations('Frequency')

  const { data: allPrizeInfo, isFetched: isFetchedAllPrizeInfo } = useAllPrizeInfo([prizePool])
  const { data: tokenData, isFetched: isFetchedTokenData } = usePrizeTokenData(prizePool)
  const { data: drawPeriod } = useDrawPeriod(prizePool)

  const prizeRows = isFetchedAllPrizeInfo ? Object.values(allPrizeInfo)[0].slice(0, -2) : []

  const { data: firstDrawOpenedAt } = useFirstDrawOpenedAt(prizePool)
  const { data: drawIds, isFetched: isFetchedDrawIds } = useDrawIds(prizePool)

  const currentDrawId = isFetchedDrawIds ? drawIds.at(-1) : undefined
  const currentDrawClosesAt =
    !!drawPeriod && !!currentDrawId && !!firstDrawOpenedAt
      ? firstDrawOpenedAt + currentDrawId * drawPeriod
      : undefined

  const { years, days, hours, minutes, seconds } = useCountdown(currentDrawClosesAt ?? 0)
  const countdownToCurrentDrawClose = !!currentDrawClosesAt
    ? { days: years * 365 + days, hours, minutes, seconds }
    : undefined
  const formattedCountdownToCurrentDrawClose = !!countdownToCurrentDrawClose
    ? `${!!countdownToCurrentDrawClose.days ? `${countdownToCurrentDrawClose.days}:` : ''}${
        countdownToCurrentDrawClose.hours < 10
          ? '0' + countdownToCurrentDrawClose.hours
          : countdownToCurrentDrawClose.hours
      }:${
        countdownToCurrentDrawClose.minutes < 10
          ? '0' + countdownToCurrentDrawClose.minutes
          : countdownToCurrentDrawClose.minutes
      }:${
        countdownToCurrentDrawClose.seconds < 10
          ? '0' + countdownToCurrentDrawClose.seconds
          : countdownToCurrentDrawClose.seconds
      }`
    : undefined

  return (
    <Card
      wrapperClassName={className}
      className={classNames('gap-3 items-center !justify-start md:gap-4', innerClassName)}
    >
      <NetworkBadge
        chainId={prizePool.chainId}
        hideBg={true}
        className={networkClassName}
        iconClassName='w-6 h-6'
        textClassName='text-xl font-semibold'
      />
      <div
        className={classNames(
          'w-full flex text-xs text-pt-purple-100/50 md:text-sm',
          'pb-2 border-b-[0.5px] border-b-current',
          headersClassName
        )}
      >
        <span className='flex-grow pl-8 text-left md:pl-16'>{t_prizes('prize')}</span>
        <span className='flex-grow pr-8 text-right md:pr-16'>{t_prizes('frequency')}</span>
      </div>
      {isFetchedAllPrizeInfo && isFetchedTokenData && !!tokenData && !!drawPeriod ? (
        <div className='w-full flex flex-col gap-3'>
          {prizeRows.map((prize, i) => {
            const frequency = formatDailyCountToFrequency(prize.dailyFrequency, {
              minTimespan: drawPeriod
            })

            return (
              <div key={`pp-prizes-${prizePool.chainId}-${i}`} className='w-full flex items-center'>
                <span
                  className={classNames(
                    'flex-grow text-left text-pt-teal/90',
                    'pl-6 text-lg md:pl-12 md:text-3xl',
                    prizeClassName
                  )}
                >
                  <TokenValue
                    token={{ ...tokenData, amount: prize.amount.current }}
                    hideZeroes={true}
                    fallback={
                      <TokenAmount
                        token={{ ...tokenData, amount: prize.amount.current }}
                        maximumFractionDigits={4}
                      />
                    }
                  />
                </span>
                <span
                  className={classNames(
                    'flex-grow text-right text-pt-purple-100',
                    'pr-6 md:pr-12 md:text-xl',
                    frequencyClassName
                  )}
                >
                  {getPrizeTextFromFrequency(frequency, 'everyXdays', t_freq)}
                </span>
              </div>
            )
          })}

          {!!minPrizeRows && prizeRows.length < minPrizeRows && (
            <>
              {[...Array(minPrizeRows - prizeRows.length).keys()].map((i) => (
                <div key={`pp-prizes-${prizePool.chainId}-empty-${i}`} className='h-7 md:h-9' />
              ))}
            </>
          )}
        </div>
      ) : (
        <Spinner />
      )}
      {!!currentDrawId && (
        <div className={classNames('flex flex-col mt-auto text-sm md:text-lg', drawsClassName)}>
          {currentDrawId > 1 && (
            <div className={classNames('text-pt-purple-100', prevDrawClassName)}>
              {t_prizes('drawBeingAwarded', { drawId: currentDrawId - 1 })}
            </div>
          )}
          {!!formattedCountdownToCurrentDrawClose && (
            <div className={classNames('text-pt-purple-100/60', currentDrawClassName)}>
              {t_prizes.rich('drawWillCloseIn', {
                drawId: currentDrawId,
                countdown: () => (
                  <span className='text-pt-purple-300/60'>
                    {formattedCountdownToCurrentDrawClose}
                  </span>
                )
              })}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
