import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeDrawTimestamps } from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { PRIZE_POOLS, sToMs } from '@shared/utilities'
import classNames from 'classnames'
import { useEffect, useMemo, useState } from 'react'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { useDrawRngFeePercentage } from '@hooks/useDrawRngFeePercentage'
import { useRelayAuctionElapsedTime } from '@hooks/useRelayAuctionElapsedTime'
import { useRelayAuctionEvents } from '@hooks/useRelayAuctionEvents'
import { useRngAuctionEvents } from '@hooks/useRngAuctionEvents'
import { useRngTxs } from '@hooks/useRngTxs'
import { DrawCard } from './DrawCard'

interface DrawCardsProps {
  chainId: number
  className?: string
}

export const DrawCards = (props: DrawCardsProps) => {
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

  const { data: rngTxs, isFetched: isFetchedRngTxs } = useRngTxs(prizePool)

  const { refetch: refetchDrawRngFeePercentage } = useDrawRngFeePercentage()
  const { refetch: refetchRngAuctionEvents } = useRngAuctionEvents()
  const { refetch: refetchRelayAuctionElapsedTime } = useRelayAuctionElapsedTime()
  const { refetch: refetchRelayAuctionEvents } = useRelayAuctionEvents(prizePool)
  const { refetch: refetchPrizeDrawTimestamps } = usePrizeDrawTimestamps(prizePool)

  // Automatic data refetching
  useEffect(() => {
    const interval = setInterval(() => {
      refetchDrawRngFeePercentage()
      refetchRngAuctionEvents()
      refetchRelayAuctionElapsedTime()
      refetchRelayAuctionEvents()
      refetchPrizeDrawTimestamps()
    }, sToMs(300))

    return () => clearInterval(interval)
  }, [])

  const baseNumDraws = 7
  const [numDraws, setNumDraws] = useState<number>(baseNumDraws)

  if (!isFetchedRngTxs || !rngTxs) {
    return <Spinner />
  }

  const lastRngTxs = rngTxs[rngTxs.length - 1]
  const lastDrawId = lastRngTxs.rng.drawId

  return (
    <div className={classNames('w-full flex flex-col gap-3 items-center', className)}>
      {!!lastRngTxs.relay && (
        <DrawCard
          key={`draw-${lastDrawId + 1}-${chainId}`}
          prizePool={prizePool}
          drawId={lastDrawId + 1}
        />
      )}
      {[...rngTxs]
        .reverse()
        .slice(0, numDraws)
        .map((txs) => (
          <DrawCard
            key={`draw-${txs.rng.drawId}-${chainId}`}
            prizePool={prizePool}
            drawId={txs.rng.drawId}
          />
        ))}
      {rngTxs.length > numDraws && (
        <span onClick={() => setNumDraws(numDraws + baseNumDraws)} className='cursor-pointer'>
          Show More Draws
        </span>
      )}
    </div>
  )
}
