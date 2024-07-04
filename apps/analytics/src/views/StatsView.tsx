import classNames from 'classnames'
import { PPCOverTimeChart } from '@components/Charts/PPCOverTimeChart'
import { TVLByTokenChart } from '@components/Charts/TVLByToken'
import { TVLOverTimeChart } from '@components/Charts/TVLOverTimeChart'
import { PrizesCard } from '@components/Stats/PrizesCard'
import { WalletsCard } from '@components/Stats/WalletsCard'
import { usePrizePool } from '@hooks/usePrizePool'

interface StatsViewProps {
  chainId: number
  className?: string
}

export const StatsView = (props: StatsViewProps) => {
  const { chainId, className } = props

  const prizePool = usePrizePool(chainId)

  return (
    <div className={classNames('w-full flex flex-col gap-6 items-center', className)}>
      <div className='w-full grid grid-cols-1 gap-6 items-center md:grid-cols-2'>
        <PrizesCard prizePool={prizePool} className='h-full' />
        <WalletsCard prizePool={prizePool} className='h-full' />
      </div>
      <div className='w-full grid grid-cols-1 gap-6 items-center md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]'>
        <TVLOverTimeChart prizePool={prizePool} />
        <TVLByTokenChart prizePool={prizePool} />
      </div>
      <PPCOverTimeChart prizePool={prizePool} hideFirstDraws={3} />
    </div>
  )
}
