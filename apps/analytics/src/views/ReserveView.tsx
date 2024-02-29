import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useDrawManagerDrawAwardedEvents,
  useLiquidationEvents,
  useManualContributionEvents,
  usePrizeBackstopEvents,
  usePrizePoolDrawAwardedEvents,
  useRngAuctionCompletedEvents
} from '@generationsoftware/hyperstructure-react-hooks'
import { getSecondsSinceEpoch, PRIZE_POOLS, sToMs } from '@shared/utilities'
import classNames from 'classnames'
import { useSetAtom } from 'jotai'
import { useEffect, useMemo } from 'react'
import { currentTimestampAtom } from 'src/atoms'
import { PublicClient } from 'viem'
import { usePublicClient } from 'wagmi'
import { ReserveChart } from '@components/Charts/ReserveChart'
import { ReserveHeader } from '@components/Reserve/ReserveHeader'
import { QUERY_START_BLOCK } from '@constants/config'
import { useReserve } from '@hooks/useReserve'

interface ReserveViewProps {
  chainId: number
  className?: string
}

export const ReserveView = (props: ReserveViewProps) => {
  const { chainId, className } = props

  const publicClient = usePublicClient({ chainId })

  const setCurrentTimestamp = useSetAtom(currentTimestampAtom)

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

  const { refetch: refetchReserve } = useReserve(prizePool)
  const { refetch: refetchLiquidationEvents } = useLiquidationEvents(prizePool?.chainId, {
    fromBlock
  })
  const { refetch: refetchManualContributionEvents } = useManualContributionEvents(prizePool, {
    fromBlock
  })
  const { refetch: refetchPrizeBackstopEvents } = usePrizeBackstopEvents(prizePool, { fromBlock })
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
      refetchReserve()
      refetchLiquidationEvents()
      refetchManualContributionEvents()
      refetchPrizeBackstopEvents()
      refetchRngAuctionCompletedEvents()
      refetchPrizePoolDrawAwardedEvents()
      refetchDrawManagerDrawAwardedEvents()
      setCurrentTimestamp(getSecondsSinceEpoch())
    }, sToMs(300))

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={classNames('w-full flex flex-col gap-6 items-center', className)}>
      <ReserveHeader prizePool={prizePool} />
      <ReserveChart prizePool={prizePool} />
    </div>
  )
}
