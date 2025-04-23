import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { formatNumberForDisplay, getNiceNetworkNameByChainId } from '@shared/utilities'
import classNames from 'classnames'
import { TVLByTokenChart } from '@components/Charts/TVLByToken'
import { TVLOverTimeChart } from '@components/Charts/TVLOverTimeChart'
import { useDeposits } from '@hooks/useDeposits'
import { CategoryHeader } from './CategoryHeader'
import { StatCards } from './StatCards'

interface TVLStatsProps {
  prizePool: PrizePool
  className?: string
}

export const TVLStats = (props: TVLStatsProps) => {
  const { prizePool, className } = props

  const { data: deposits } = useDeposits(prizePool)

  return (
    <div className={classNames('w-full flex flex-col items-center gap-4', className)}>
      <CategoryHeader name={`${getNiceNetworkNameByChainId(prizePool.chainId)} Deposits`} />
      <div className='w-full grid grid-cols-1 gap-6 px-4 py-6 bg-pt-transparent rounded-2xl md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]'>
        <TVLOverTimeChart prizePool={prizePool} />
        <TVLByTokenChart prizePool={prizePool} />
      </div>
      <StatCards
        cards={[
          {
            id: 'medianDeposit',
            title: 'Median Deposit Transaction',
            value:
              deposits !== undefined
                ? formatNumberForDisplay(deposits.medianValue, { maximumFractionDigits: 5 })
                : undefined,
            unit: 'ETH'
          },
          {
            id: 'avgDeposit',
            title: 'Average Deposit Transaction',
            value:
              deposits !== undefined
                ? formatNumberForDisplay(deposits.avgValue, { maximumFractionDigits: 5 })
                : undefined,
            unit: 'ETH'
          }
        ]}
        className='sm:grid-cols-2'
      />
    </div>
  )
}
