import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { PRIZE_POOLS, sToMs } from '@shared/utilities'
import { useEffect, useMemo } from 'react'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { DrawCards } from '@components/Draws/DrawCards'
import { useDrawClosedEvents } from '@hooks/useDrawClosedEvents'
import { useDrawRngFeePercentage } from '@hooks/useDrawRngFeePercentage'
import { useRelayAuctionElapsedTime } from '@hooks/useRelayAuctionElapsedTime'
import { useRelayAuctionEvents } from '@hooks/useRelayAuctionEvents'
import { useRngAuctionEvents } from '@hooks/useRngAuctionEvents'

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
  const { refetch: refetchRelayAuctionElapsedTime } = useRelayAuctionElapsedTime()
  const { refetch: refetchRelayAuctionEvents } = useRelayAuctionEvents(prizePool)
  const { refetch: refetchDrawClosedEvents } = useDrawClosedEvents(prizePool)

  // Automatic data refetching
  useEffect(() => {
    const interval = setInterval(() => {
      refetchDrawRngFeePercentage()
      refetchRngAuctionEvents()
      refetchRelayAuctionElapsedTime()
      refetchRelayAuctionEvents()
      refetchDrawClosedEvents()
    }, sToMs(300))

    return () => clearInterval(interval)
  }, [])

  return <DrawCards prizePool={prizePool} className={className} />
}
