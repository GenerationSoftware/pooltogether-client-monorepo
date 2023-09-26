import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { PRIZE_POOLS, SECONDS_PER_DAY, sToMs } from '@shared/utilities'
import classNames from 'classnames'
import { useAtom } from 'jotai'
import { useEffect, useMemo } from 'react'
import { currentTimestampAtom } from 'src/atoms'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { ReserveCard } from '@components/Reserve/ReserveCard'
import { ReserveHeader } from '@components/Reserve/ReserveHeader'
import { useBlockAtTimestamp } from '@hooks/useBlockAtTimestamp'
import { useDrawClosedEvents } from '@hooks/useDrawClosedEvents'
import { useLiquidationEvents } from '@hooks/useLiquidationEvents'
import { useManualContributionEvents } from '@hooks/useManualContributionEvents'
import { usePrizeBackstopEvents } from '@hooks/usePrizeBackstopEvents'
import { useRelayAuctionEvents } from '@hooks/useRelayAuctionEvents'
import { useReserve } from '@hooks/useReserve'
import { useRngAuctionEvents } from '@hooks/useRngAuctionEvents'

interface ReserveViewProps {
  chainId: number
  className?: string
}

export const ReserveView = (props: ReserveViewProps) => {
  const { chainId, className } = props

  const publicClient = usePublicClient({ chainId })

  const [currentTimestamp, setCurrentTimestamp] = useAtom(currentTimestampAtom)

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

  const { data: minBlock } = useBlockAtTimestamp(
    prizePool.chainId,
    currentTimestamp - SECONDS_PER_DAY
  )

  const { refetch: refetchReserve } = useReserve(prizePool)
  const { refetch: refetchLiquidationEvents } = useLiquidationEvents(prizePool)
  const { refetch: refetchManualContributionEvents } = useManualContributionEvents(prizePool)
  const { refetch: refetchPrizeBackstopEvents } = usePrizeBackstopEvents(prizePool)
  const { refetch: refetchRngAuctionEvents } = useRngAuctionEvents()
  const { refetch: refetchRelayAuctionEvents } = useRelayAuctionEvents(prizePool)
  const { refetch: refetchDrawClosedEvents } = useDrawClosedEvents(prizePool)

  // Automatic data refetching
  useEffect(() => {
    const interval = setInterval(() => {
      refetchReserve()
      refetchLiquidationEvents()
      refetchManualContributionEvents()
      refetchPrizeBackstopEvents()
      refetchRngAuctionEvents()
      refetchRelayAuctionEvents()
      refetchDrawClosedEvents()
      setCurrentTimestamp(Math.floor(Date.now() / 1_000))
    }, sToMs(300))

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={classNames('w-full flex flex-col gap-6 items-center', className)}>
      <ReserveHeader prizePool={prizePool} />
      {/* TODO: this is not accurate atm - would need actual liquidations or reserve amount at X block */}
      {/* {!!minBlock && <ReserveCard prizePool={prizePool} minBlock={minBlock} className='max-w-md' />} */}
      <ReserveCard prizePool={prizePool} className='max-w-md' />
    </div>
  )
}
