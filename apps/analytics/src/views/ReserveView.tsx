import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useDrawAwardedEvents,
  useLiquidationEvents,
  useManualContributionEvents,
  usePrizeBackstopEvents,
  useRelayAuctionEvents,
  useRngAuctionEvents,
  useRngL1RelayMsgEvents,
  useRngL2RelayMsgEvents
} from '@generationsoftware/hyperstructure-react-hooks'
import { getSecondsSinceEpoch, PRIZE_POOLS, RNG_RELAY_ADDRESSES, sToMs } from '@shared/utilities'
import classNames from 'classnames'
import { useSetAtom } from 'jotai'
import { useEffect, useMemo } from 'react'
import { currentTimestampAtom } from 'src/atoms'
import { Address, PublicClient } from 'viem'
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
    const prizePoolInfo = PRIZE_POOLS.find((pool) => pool.chainId === chainId) as {
      chainId: number
      address: Address
      options: {
        prizeTokenAddress: Address
        drawPeriodInSeconds: number
        tierShares: number
        reserveShares: number
      }
    }

    return new PrizePool(
      prizePoolInfo.chainId,
      prizePoolInfo.address,
      publicClient as PublicClient,
      prizePoolInfo.options
    )
  }, [chainId, publicClient])

  const originChainId = !!prizePool
    ? RNG_RELAY_ADDRESSES[prizePool.chainId].from.chainId
    : undefined
  const fromBlock = !!prizePool ? QUERY_START_BLOCK[prizePool.chainId] : undefined
  const originFromBlock = !!originChainId ? QUERY_START_BLOCK[originChainId] : undefined

  const { refetch: refetchReserve } = useReserve(prizePool)
  const { refetch: refetchLiquidationEvents } = useLiquidationEvents(prizePool?.chainId, {
    fromBlock
  })
  const { refetch: refetchManualContributionEvents } = useManualContributionEvents(prizePool, {
    fromBlock
  })
  const { refetch: refetchPrizeBackstopEvents } = usePrizeBackstopEvents(prizePool, { fromBlock })
  const { refetch: refetchRngAuctionEvents } = useRngAuctionEvents(originChainId as number, {
    fromBlock: originFromBlock
  })
  const { refetch: refetchRngL1RelayMsgEvents } = useRngL1RelayMsgEvents(
    originChainId as number,
    prizePool?.chainId,
    { fromBlock: originFromBlock }
  )
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
      refetchReserve()
      refetchLiquidationEvents()
      refetchManualContributionEvents()
      refetchPrizeBackstopEvents()
      refetchRngAuctionEvents()
      refetchRngL1RelayMsgEvents()
      refetchRelayAuctionEvents()
      refetchDrawAwardedEvents()
      refetchRngL2RelayMsgEvents()
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
