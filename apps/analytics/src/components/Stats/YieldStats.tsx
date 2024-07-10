import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import classNames from 'classnames'
import { PPCOverTimeChart } from '@components/Charts/PPCOverTimeChart'
import { CategoryHeader } from './CategoryHeader'

interface YieldStatsProps {
  prizePool: PrizePool
  className?: string
}

export const YieldStats = (props: YieldStatsProps) => {
  const { prizePool, className } = props

  return (
    <div className={classNames('w-full flex flex-col items-center gap-4', className)}>
      <CategoryHeader name='Yield' />
      <div className='w-full px-4 py-6 bg-pt-transparent rounded-2xl'>
        <PPCOverTimeChart prizePool={prizePool} hideFirstDraws={3} />
      </div>
    </div>
  )
}
