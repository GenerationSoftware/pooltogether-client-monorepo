import { useAllDrawPeriods, useAllUserPrizeOdds } from '@pooltogether/hyperstructure-react-hooks'
import { formatNumberForDisplay } from '@shared/utilities'
import { calculateUnionProbability, SECONDS_PER_WEEK } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'

interface AccountOddsProps {
  address?: Address
  className?: string
}

export const AccountOdds = (props: AccountOddsProps) => {
  const { address, className } = props

  const t = useTranslations('Account')

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const { data: prizeOdds, isFetched: isFetchedPrizeOdds } = useAllUserPrizeOdds(
    prizePoolsArray,
    userAddress as Address
  )

  const { data: drawPeriods, isFetched: isFetchedDrawPeriods } = useAllDrawPeriods(prizePoolsArray)

  const isFetched = isFetchedPrizeOdds && isFetchedDrawPeriods

  const weeklyChance = useMemo(() => {
    const events: number[] = []

    for (const prizePoolId in prizeOdds) {
      const odds = prizeOdds[prizePoolId]
      const drawPeriod = drawPeriods[prizePoolId]
      if (!!odds && !!drawPeriod) {
        const drawsPerWeek = SECONDS_PER_WEEK / drawPeriod
        const draws = Array<number>(drawsPerWeek).fill(odds)
        const prizePoolChance = calculateUnionProbability(draws)
        events.push(prizePoolChance)
      }
    }

    if (events.length > 0) {
      const value = 1 / calculateUnionProbability(events)
      const formattedValue = formatNumberForDisplay(value, { maximumSignificantDigits: 3 })
      return t('oneInXChance', { number: formattedValue })
    }
  }, [isFetched])

  if (isFetched && weeklyChance !== undefined) {
    return (
      <div
        className={classNames(
          'w-full max-w-xl flex items-center justify-between px-4 py-1 text-pt-purple-100 rounded-lg',
          'lg:max-w-none lg:py-6 lg:bg-pt-bg-purple',
          className
        )}
      >
        <span className='text-xs lg:text-base'>{t('weeklyPrizeOdds')}</span>
        <span>{weeklyChance}</span>
      </div>
    )
  }

  return <></>
}
