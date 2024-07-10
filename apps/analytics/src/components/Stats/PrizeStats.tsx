import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  usePrizeDrawWinners,
  usePrizeTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { formatNumberForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'
import { formatUnits } from 'viem'
import { CategoryHeader } from './CategoryHeader'
import { StatCards } from './StatCards'

interface PrizeStatsProps {
  prizePool: PrizePool
  className?: string
}

export const PrizeStats = (props: PrizeStatsProps) => {
  const { prizePool, className } = props

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  const { data: draws } = usePrizeDrawWinners(prizePool)

  const totalPrizes = useMemo(() => {
    if (!!draws && !!prizeToken) {
      let numPrizes = 0
      let numPrizesWithCanary = 0
      let sumAmount = 0n

      draws.forEach((draw) => {
        draw.prizeClaims.forEach((claim) => {
          numPrizesWithCanary++

          if (!!claim.payout) {
            numPrizes++
            sumAmount += claim.payout
          }
        })
      })

      return {
        num: numPrizes,
        numWithCanary: numPrizesWithCanary,
        amount: parseFloat(formatUnits(sumAmount, prizeToken.decimals))
      }
    }
  }, [draws, prizeToken])

  return (
    <div className={classNames('w-full flex flex-col items-center gap-4', className)}>
      <CategoryHeader name='Prizes' />
      <StatCards
        cards={[
          {
            id: 'totalNumPrizes',
            title: 'Total Prizes Awarded',
            value: totalPrizes !== undefined ? formatNumberForDisplay(totalPrizes.num) : undefined
          },
          {
            id: 'totalPrizeAmount',
            title: 'Total Amount Awarded',
            value:
              totalPrizes !== undefined
                ? formatNumberForDisplay(totalPrizes.amount, { maximumFractionDigits: 4 })
                : undefined,
            unit: prizeToken?.symbol
          },
          {
            id: 'totalNumPrizesWithCanary',
            title: 'Total Prizes Awarded',
            subtitle: '(including canary)',
            value:
              totalPrizes !== undefined
                ? formatNumberForDisplay(totalPrizes.numWithCanary)
                : undefined
          }
        ]}
        className='sm:grid-cols-2 md:grid-cols-3'
      />
    </div>
  )
}
