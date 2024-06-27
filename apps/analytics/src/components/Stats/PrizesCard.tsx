import { formatNumberForDisplay, PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useAllPrizeInfo, usePrizeTokenData } from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useMemo } from 'react'
import { formatUnits } from 'viem'

interface PrizesCardProps {
  prizePool: PrizePool
  className?: string
}

export const PrizesCard = (props: PrizesCardProps) => {
  const { prizePool, className } = props

  const { data: allPrizeInfo, isFetched: isFetchedAllPrizeInfo } = useAllPrizeInfo([prizePool])
  const { data: prizeToken, isFetched: isFetchedPrizeToken } = usePrizeTokenData(prizePool)

  const isFetched =
    isFetchedAllPrizeInfo && !!allPrizeInfo[prizePool.id] && isFetchedPrizeToken && !!prizeToken

  const prizeAmounts = useMemo(() => {
    if (isFetched) {
      return allPrizeInfo[prizePool.id].map((prizeInfo) =>
        parseFloat(formatUnits(prizeInfo.amount.current, prizeToken.decimals))
      )
    }
  }, [allPrizeInfo, prizeToken, isFetched])

  return (
    <div className={classNames('flex flex-col p-4 bg-pt-transparent rounded-2xl', className)}>
      <span className='text-pt-purple-400'>Prizes</span>
      {!!prizeAmounts && !!prizeToken ? (
        <>
          {prizeAmounts.map((prizeAmount, tier) => {
            const tierName =
              tier === 0 ? 'GP' : tier >= prizeAmounts.length - 2 ? 'Canary' : `Tier ${tier}`
            const formattedAmount = formatNumberForDisplay(prizeAmount, {
              maximumFractionDigits: 4
            })

            return (
              <div className='flex justify-between items-center gap-4'>
                <span>{tierName}</span>
                <span>
                  {formattedAmount === '0' ? '< 0.0001' : formattedAmount} {prizeToken.symbol}
                </span>
              </div>
            )
          })}
        </>
      ) : (
        <Spinner />
      )}
    </div>
  )
}
