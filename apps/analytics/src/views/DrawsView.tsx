import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useDrawAwardedEvents,
  useRelayAuctionEvents,
  useRngAuctionEvents,
  useRngL1RelayMsgEvents,
  useRngL2RelayMsgEvents
} from '@generationsoftware/hyperstructure-react-hooks'
import { PRIZE_POOLS, RNG_RELAY_ADDRESSES, sToMs } from '@shared/utilities'
import classNames from 'classnames'
import { useEffect, useMemo } from 'react'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { DrawsAvgClaimFeesChart } from '@components/Charts/DrawsAvgClaimFeesChart'
import { DrawsAvgLiqEfficiencyChart } from '@components/Charts/DrawsAvgLiqEfficiencyChart'
import { DrawCards } from '@components/Draws/DrawCards'
import { QUERY_START_BLOCK } from '@constants/config'
import { useDrawRngFeePercentage } from '@hooks/useDrawRngFeePercentage'
import { useRelayAuctionElapsedTime } from '@hooks/useRelayAuctionElapsedTime'

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

  const originChainId = !!prizePool
    ? RNG_RELAY_ADDRESSES[prizePool.chainId].from.chainId
    : undefined
  const fromBlock = !!prizePool ? QUERY_START_BLOCK[prizePool.chainId] : undefined
  const originFromBlock = !!originChainId ? QUERY_START_BLOCK[originChainId] : undefined

  const { refetch: refetchDrawRngFeePercentage } = useDrawRngFeePercentage(prizePool)
  const { refetch: refetchRngAuctionEvents } = useRngAuctionEvents(originChainId as number, {
    fromBlock: originFromBlock
  })
  const { refetch: refetchRngL1RelayMsgEvents } = useRngL1RelayMsgEvents(
    originChainId as number,
    prizePool?.chainId,
    { fromBlock: originFromBlock }
  )
  const { refetch: refetchRelayAuctionElapsedTime } = useRelayAuctionElapsedTime(prizePool)
  const { refetch: refetchRelayAuctionEvents } = useRelayAuctionEvents(prizePool?.chainId, {
    fromBlock
  })
  const { refetch: refetchDrawAwardedEvents } = useDrawAwardedEvents(prizePool, { fromBlock })
  const { refetch: refetchRngL2RelayMsgEvents } = useRngL2RelayMsgEvents(prizePool?.chainId, {
    fromBlock
  })

  // Automatic data refetching
  useEffect(() => {
    const interval = setInterval(() => {
      refetchDrawRngFeePercentage()
      refetchRngAuctionEvents()
      refetchRngL1RelayMsgEvents()
      refetchRelayAuctionElapsedTime()
      refetchRelayAuctionEvents()
      refetchDrawAwardedEvents()
      refetchRngL2RelayMsgEvents()
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
