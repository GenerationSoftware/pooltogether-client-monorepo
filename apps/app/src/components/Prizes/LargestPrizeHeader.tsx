import { useLargestGrandPrize } from '@pooltogether/hyperstructure-react-hooks'
import { NextDrawCountdown, TokenValue } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { useTranslations } from 'next-intl'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'

export const LargestPrizeHeader = () => {
  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const { data: gpData } = useLargestGrandPrize(prizePoolsArray)

  const t_home = useTranslations('Home')
  const t_short = useTranslations('Abbreviations')

  return (
    <>
      <div className='flex flex-col items-center gap-3'>
        <span className='w-2/3 text-2xl text-center font-averta font-semibold md:w-full md:text-4xl lg:text-5xl'>
          {t_home('winUpToFirst')}{' '}
          {!!gpData ? (
            <TokenValue token={gpData.token} hideZeroes={true} countUp={true} />
          ) : (
            <Spinner />
          )}{' '}
          {t_home('winUpToSecond')}
        </span>
        <span className='hidden text-pt-purple-100 md:block'>{t_home('chanceToWin')}</span>
      </div>
      <NextDrawCountdown
        prizePool={prizePoolsArray[0]}
        intl={{
          title: t_home('nextDrawIn'),
          abbreviations: {
            hours: t_short('hours'),
            minutes: t_short('minutes'),
            seconds: t_short('seconds')
          }
        }}
      />
    </>
  )
}
