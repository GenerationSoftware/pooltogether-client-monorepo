import classNames from 'classnames'
import { TVLOverTimeChart } from '@components/Charts/TVLOverTimeChart'
import { PrizesCard } from '@components/Stats/PrizesCard'
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
      {/* TODO: display PPC over time (similar chart to vault page on the app) */}
      {/* TODO: display TUW currently and over time */}
      {/* TODO: display prize yield over time */}
      {/* TODO: display deposit metrics (avg, median) */}
    </div>
  )
}