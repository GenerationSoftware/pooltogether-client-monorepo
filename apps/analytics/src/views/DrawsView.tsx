import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { PRIZE_POOLS, sToMs } from '@shared/utilities'
import classNames from 'classnames'
import { useEffect, useMemo } from 'react'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { AvgClaimFeePercentagesChart } from '@components/Charts/AvgClaimFeePercentagesChart'
import { AvgLiqEfficiencyChart } from '@components/Charts/AvgLiqEfficiencyChart'
import { DrawCards } from '@components/Draws/DrawCards'
import { useDrawClosedEvents } from '@hooks/useDrawClosedEvents'
import { useDrawRngFeePercentage } from '@hooks/useDrawRngFeePercentage'
import { useRelayAuctionElapsedTime } from '@hooks/useRelayAuctionElapsedTime'
import { useRelayAuctionEvents } from '@hooks/useRelayAuctionEvents'
import { useRngAuctionEvents } from '@hooks/useRngAuctionEvents'
import { useRngL1RelayMsgEvents } from '@hooks/useRngL1RelayMsgEvents'
import { useRngL2RelayMsgEvents } from '@hooks/useRngL2RelayMsgEvents'

interface DrawsViewProps {
  chainId: number
  className?: string
}

export const DrawsView = (props: DrawsViewProps) => {
  const { chainId, className } = props

  const publicClient = usePublicClient({ chainId })

  const prizePool = useMemo(() => {
    const prizePoolInfo = PRIZE_POOLS.find((pool) => pool.chainId === chainId) as {
      chainId: number
      address: Address
      options: { prizeTokenAddress: Address; drawPeriodInSeconds: number; tierShares: number }
    }

    return new PrizePool(
      prizePoolInfo.chainId,
      prizePoolInfo.address,
      publicClient,
      prizePoolInfo.options
    )
  }, [chainId])

  const { refetch: refetchDrawRngFeePercentage } = useDrawRngFeePercentage()
  const { refetch: refetchRngAuctionEvents } = useRngAuctionEvents()
  const { refetch: refetchRngL1RelayMsgEvents } = useRngL1RelayMsgEvents()
  const { refetch: refetchRelayAuctionElapsedTime } = useRelayAuctionElapsedTime()
  const { refetch: refetchRelayAuctionEvents } = useRelayAuctionEvents(prizePool)
  const { refetch: refetchDrawClosedEvents } = useDrawClosedEvents(prizePool)
  const { refetch: refetchRngL2RelayMsgEvents } = useRngL2RelayMsgEvents(prizePool)

  // Automatic data refetching
  useEffect(() => {
    const interval = setInterval(() => {
      refetchDrawRngFeePercentage()
      refetchRngAuctionEvents()
      refetchRngL1RelayMsgEvents()
      refetchRelayAuctionElapsedTime()
      refetchRelayAuctionEvents()
      refetchDrawClosedEvents()
      refetchRngL2RelayMsgEvents()
    }, sToMs(300))

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={classNames('w-full flex flex-col gap-6 items-center', className)}>
      <div className='w-full grid grid-cols-1 gap-6 md:grid-cols-2'>
        <AvgClaimFeePercentagesChart prizePool={prizePool} />
        <AvgLiqEfficiencyChart prizePool={prizePool} />
      </div>
      <DrawCards prizePool={prizePool} />
    </div>
  )
}
