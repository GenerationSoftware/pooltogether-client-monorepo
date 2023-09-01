import { useLargestGrandPrize } from '@generationsoftware/hyperstructure-react-hooks'
import { NextDrawCountdown, TokenAmount, TokenValue } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { useTranslations } from 'next-intl'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'

export const LargestPrizeHeader = () => {
  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const { data: gpData } = useLargestGrandPrize(prizePoolsArray, { useCurrentPrizeSizes: true })

  const t_home = useTranslations('Home')
  const t_short = useTranslations('Abbreviations')

  return (
    <>
      <div className='flex flex-col items-center gap-3'>
        <span className='w-2/3 text-[1.75rem] text-center font-grotesk font-medium md:w-full md:text-4xl lg:text-5xl'>
          {t_home('winUpTo.beforeValue')}{' '}
          {!!gpData ? (
            <TokenValue
              token={gpData.token}
              hideZeroes={true}
              countUp={true}
              fallback={<TokenAmount token={gpData.token} hideZeroes={true} />}
            />
          ) : (
            <Spinner />
          )}{' '}
          {t_home('winUpTo.afterValue')}
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
