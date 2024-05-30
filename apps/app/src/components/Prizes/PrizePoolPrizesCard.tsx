import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useAllPrizeInfo, usePrizeTokenData } from '@generationsoftware/hyperstructure-react-hooks'
import { NetworkBadge, TokenAmount, TokenValue } from '@shared/react-components'
import { Card, Spinner } from '@shared/ui'
import { formatDailyCountToFrequency, getPrizeTextFromFrequency } from '@shared/utilities'
import { useTranslations } from 'next-intl'

export interface PrizePoolPrizesCardProps {
  prizePool: PrizePool
  className?: string
}

export const PrizePoolPrizesCard = (props: PrizePoolPrizesCardProps) => {
  const { prizePool, className } = props

  const t_prizes = useTranslations('Prizes')
  const t_freq = useTranslations('Frequency')

  const { data: allPrizeInfo, isFetched: isFetchedAllPrizeInfo } = useAllPrizeInfo([prizePool])
  const { data: tokenData, isFetched: isFetchedTokenData } = usePrizeTokenData(prizePool)

  return (
    <Card wrapperClassName={className} className='gap-3 items-center !justify-start md:gap-4'>
      <NetworkBadge
        chainId={prizePool.chainId}
        hideBg={true}
        iconClassName='w-6 h-6'
        textClassName='text-xl font-semibold'
      />
      <div className='w-full flex text-xs text-pt-purple-100/50 pb-2 border-b-[0.5px] border-b-current md:text-sm'>
        <span className='flex-grow pl-8 text-left md:pl-16'>{t_prizes('prize')}</span>
        <span className='flex-grow pr-8 text-right md:pr-16'>{t_prizes('frequency')}</span>
      </div>
      {isFetchedAllPrizeInfo && isFetchedTokenData && !!tokenData ? (
        <div className='w-full flex flex-col gap-3'>
          {Object.values(allPrizeInfo)[0]
            .slice(0, -2)
            .map((prize, i) => {
              const frequency = formatDailyCountToFrequency(prize.dailyFrequency)

              return (
                <div
                  key={`pp-prizes-${prizePool.chainId}-${i}`}
                  className='w-full flex items-center'
                >
                  <span className='flex-grow pl-6 text-left text-lg text-pt-teal/90 md:text-3xl md:pl-12'>
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
                  <span className='flex-grow pr-6 text-right text-pt-purple-100 md:text-xl md:pr-12'>
                    {getPrizeTextFromFrequency(frequency, 'everyXdays', t_freq)}
                  </span>
                </div>
              )
            })}
        </div>
      ) : (
        <Spinner />
      )}
    </Card>
  )
}
