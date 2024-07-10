import classNames from 'classnames'
import { PrizeStats } from '@components/Stats/PrizeStats'
import { TVLStats } from '@components/Stats/TVLStats'
import { UserStats } from '@components/Stats/UserStats'
import { YieldStats } from '@components/Stats/YieldStats'
import { usePrizePool } from '@hooks/usePrizePool'

interface StatsViewProps {
  chainId: number
  className?: string
}

export const StatsView = (props: StatsViewProps) => {
  const { chainId, className } = props

  const prizePool = usePrizePool(chainId)

  return (
    <div className={classNames('w-full flex flex-col gap-12 items-center', className)}>
      <UserStats prizePool={prizePool} />
      <PrizeStats prizePool={prizePool} />
      <TVLStats prizePool={prizePool} />
      <YieldStats prizePool={prizePool} />
    </div>
  )
}
