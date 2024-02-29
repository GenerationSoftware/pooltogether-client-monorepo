import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useDrawManagerDrawAwardedEvents,
  usePrizePoolDrawAwardedEvents,
  useRngAuctionCompletedEvents
} from '@generationsoftware/hyperstructure-react-hooks'
import { PRIZE_POOLS, sToMs } from '@shared/utilities'
import classNames from 'classnames'
import { useEffect, useMemo } from 'react'
import { PublicClient } from 'viem'
import { usePublicClient } from 'wagmi'
import { DrawsAvgClaimFeesChart } from '@components/Charts/DrawsAvgClaimFeesChart'
import { DrawsAvgLiqEfficiencyChart } from '@components/Charts/DrawsAvgLiqEfficiencyChart'
import { DrawCards } from '@components/Draws/DrawCards'
import { QUERY_START_BLOCK } from '@constants/config'
import { useCurrentDrawAwardReward } from '@hooks/useCurrentDrawAwardReward'
import { useCurrentRngAuctionReward } from '@hooks/useCurrentRngAuctionReward'

interface DrawsViewProps {
  chainId: number
  className?: string
}

export const DrawsView = (props: DrawsViewProps) => {
  const { chainId, className } = props

  const publicClient = usePublicClient({ chainId })

  const prizePool = useMemo(() => {
    const prizePoolInfo = PRIZE_POOLS.find(
      (pool) => pool.chainId === chainId
    ) as (typeof PRIZE_POOLS)[number]

    return new PrizePool(
      prizePoolInfo.chainId,
      prizePoolInfo.address,
      publicClient as PublicClient,
      prizePoolInfo.options
    )
  }, [chainId, publicClient])

  const fromBlock = !!prizePool ? QUERY_START_BLOCK[prizePool.chainId] : undefined

  const { refetch: refetchCurrentRngAuctionReward } = useCurrentRngAuctionReward(prizePool)
  const { refetch: refetchCurrentDrawAwardReward } = useCurrentDrawAwardReward(prizePool)
  const { refetch: refetchRngAuctionCompletedEvents } = useRngAuctionCompletedEvents(prizePool, {
    fromBlock
  })
  const { refetch: refetchPrizePoolDrawAwardedEvents } = usePrizePoolDrawAwardedEvents(prizePool, {
    fromBlock
  })
  const { refetch: refetchDrawManagerDrawAwardedEvents } = useDrawManagerDrawAwardedEvents(
    prizePool,
    { fromBlock }
  )

  // Automatic data refetching
  useEffect(() => {
    const interval = setInterval(() => {
      refetchCurrentRngAuctionReward()
      refetchCurrentDrawAwardReward()
      refetchRngAuctionCompletedEvents()
      refetchPrizePoolDrawAwardedEvents()
      refetchDrawManagerDrawAwardedEvents()
    }, sToMs(300))

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={classNames('w-full flex flex-col gap-6 items-center', className)}>
      <div className='w-full grid grid-cols-1 gap-6 md:grid-cols-2'>
        <DrawsAvgClaimFeesChart prizePool={prizePool} hideCanary={true} />
        <DrawsAvgLiqEfficiencyChart prizePool={prizePool} />
      </div>
      <DrawCards prizePool={prizePool} />
    </div>
  )
}
