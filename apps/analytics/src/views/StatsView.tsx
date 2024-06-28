import classNames from 'classnames'
import { PPCOverTimeChart } from '@components/Charts/PPCOverTimeChart'
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
      <PrizesCard prizePool={prizePool} />
      <TVLOverTimeChart prizePool={prizePool} />
      {/* TODO: display underlying token tvl composition in a pie chart */}
      <PPCOverTimeChart prizePool={prizePool} />
      <WalletsCard prizePool={prizePool} />
      {/* TODO: display prize yield over time */}
      {/* TODO: display deposit metrics (avg, median) */}
    </div>
  )
}
