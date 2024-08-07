import { sToMs } from '@shared/utilities'
import classNames from 'classnames'
import { useEffect } from 'react'
import { DrawsAvgClaimFeesChart } from '@components/Charts/DrawsAvgClaimFeesChart'
import { DrawsAvgLiqEfficiencyChart } from '@components/Charts/DrawsAvgLiqEfficiencyChart'
import { DrawCards } from '@components/Draws/DrawCards'
import { useCurrentDrawAwardReward } from '@hooks/useCurrentDrawAwardReward'
import { useCurrentRngAuctionReward } from '@hooks/useCurrentRngAuctionReward'
import { usePrizePool } from '@hooks/usePrizePool'
import { useRngTxs } from '@hooks/useRngTxs'

interface DrawsViewProps {
  chainId: number
  className?: string
}

export const DrawsView = (props: DrawsViewProps) => {
  const { chainId, className } = props

  const prizePool = usePrizePool(chainId)

  const { refetch: refetchCurrentRngAuctionReward } = useCurrentRngAuctionReward(prizePool)
  const { refetch: refetchCurrentDrawAwardReward } = useCurrentDrawAwardReward(prizePool)
  const { refetch: refetchRngTxs } = useRngTxs(prizePool)

  // Automatic data refetching
  useEffect(() => {
    const interval = setInterval(() => {
      refetchCurrentRngAuctionReward()
      refetchCurrentDrawAwardReward()
      refetchRngTxs()
    }, sToMs(300))

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={classNames('w-full flex flex-col gap-6 items-center', className)}>
      <div className='w-full grid grid-cols-1 gap-6 md:grid-cols-2'>
        <DrawsAvgClaimFeesChart prizePool={prizePool} />
        <DrawsAvgLiqEfficiencyChart prizePool={prizePool} />
      </div>
      <DrawCards prizePool={prizePool} />
    </div>
  )
}
