import { PrizePool } from '@pooltogether/hyperstructure-client-js'
import { useAllPrizeInfo, usePrizeTokenData } from '@pooltogether/hyperstructure-react-hooks'
import { TokenAmount, TokenValue } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { formatDailyCountToFrequency, getPrizeTextFromFrequency } from '@shared/utilities'
import { useTranslations } from 'next-intl'

interface PrizesTableProps {
  prizePool: PrizePool
}

export const PrizesTable = (props: PrizesTableProps) => {
  const { prizePool } = props

  const t_prizes = useTranslations('Prizes')
  const t_freq = useTranslations('Frequency')

  const { data: allPrizeInfo, isFetched: isFetchedAllPrizeInfo } = useAllPrizeInfo([prizePool])
  const { data: tokenData, isFetched: isFetchedTokenData } = usePrizeTokenData(prizePool)

  return (
    <>
      <div className='flex w-full max-w-[36rem] text-xs text-pt-purple-100 pb-4 border-b-[0.5px] border-b-current md:text-sm md:text-pt-purple-100/50 md:mt-8 md:pb-2'>
        <span className='flex-grow pl-6 text-left md:pl-16'>{t_prizes('estPrizeValue')}</span>
        <span className='flex-grow pr-6 text-right md:pr-16'>{t_prizes('estPrizeFreq')}</span>
      </div>
      {isFetchedAllPrizeInfo && isFetchedTokenData && !!tokenData ? (
        <div className='flex flex-col w-full max-w-[36rem] gap-3'>
          {Object.values(allPrizeInfo)[0]
            .slice(0, -1)
            .map((prize, i) => {
              const frequency = formatDailyCountToFrequency(prize.dailyFrequency)

              return (
                <div
                  key={`pp-prizes-${prizePool.chainId}-${i}`}
                  className='flex w-full items-center'
                >
                  <span className='flex-grow text-lg text-pt-teal pl-8 text-left md:text-3xl md:pl-16'>
                    <TokenValue
                      token={{ ...tokenData, amount: prize.amount }}
                      hideZeroes={true}
                      fallback={
                        <TokenAmount
                          token={{ ...tokenData, amount: prize.amount }}
                          maximumFractionDigits={1}
                        />
                      }
                    />
                  </span>
                  <span className='flex-grow text-pt-purple-100 pr-8 text-right md:text-xl md:pr-16'>
                    {getPrizeTextFromFrequency(frequency, 'daily', t_freq)}
                  </span>
                </div>
              )
            })}
        </div>
      ) : (
        <Spinner />
      )}
    </>
  )
}
