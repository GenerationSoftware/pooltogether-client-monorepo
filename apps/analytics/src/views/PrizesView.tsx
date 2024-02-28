import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useDrawManagerDrawAwardedEvents,
  usePrizePoolDrawAwardedEvents,
  useRngAuctionCompletedEvents
} from '@generationsoftware/hyperstructure-react-hooks'
import { PRIZE_POOLS, sToMs } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useEffect, useMemo } from 'react'
import { selectedDrawIdAtom } from 'src/atoms'
import { Address, PublicClient } from 'viem'
import { usePublicClient } from 'wagmi'
import { DrawAvgClaimFeesChart } from '@components/Charts/DrawAvgClaimFeesChart'
import { DrawSelector } from '@components/Draws/DrawSelector'
import { DrawStatusBadge } from '@components/Draws/DrawStatusBadge'
import { PrizesTable } from '@components/Prizes/PrizesTable'
import { QUERY_START_BLOCK } from '@constants/config'

interface PrizesViewProps {
  chainId: number
  className?: string
}

export const PrizesView = (props: PrizesViewProps) => {
  const { chainId, className } = props

  const publicClient = usePublicClient({ chainId })

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

  const fromBlock = !!prizePool ? QUERY_START_BLOCK[prizePool.chainId] : undefined

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
      refetchRngAuctionCompletedEvents()
      refetchPrizePoolDrawAwardedEvents()
      refetchDrawManagerDrawAwardedEvents()
    }, sToMs(300))

    return () => clearInterval(interval)
  }, [])

  const drawIdSelected = useAtomValue(selectedDrawIdAtom)

  return (
    <div className={classNames('w-full flex flex-col grow gap-2 items-center md:gap-6', className)}>
      {!!drawIdSelected && (
        <>
          <DrawStatusBadge prizePool={prizePool} drawId={drawIdSelected} />
          <DrawAvgClaimFeesChart
            prizePool={prizePool}
            drawId={drawIdSelected}
            className='max-w-4xl'
          />
          <PrizesTable prizePool={prizePool} drawId={drawIdSelected} className='md:mt-6' />
        </>
      )}
      <DrawSelector prizePool={prizePool} excludeDrawStatus={['open', 'closed']} />
    </div>
  )
}
