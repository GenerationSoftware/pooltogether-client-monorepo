import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { PRIZE_POOLS, sToMs } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useEffect, useMemo } from 'react'
import { selectedDrawIdAtom } from 'src/atoms'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { DrawSelector } from '@components/Draws/DrawSelector'
import { DrawStatusBadge } from '@components/Draws/DrawStatusBadge'
import { PrizesTable } from '@components/Prizes/PrizesTable'
import { useDrawClosedEvents } from '@hooks/useDrawClosedEvents'
import { useRelayAuctionEvents } from '@hooks/useRelayAuctionEvents'
import { useRngAuctionEvents } from '@hooks/useRngAuctionEvents'

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
      options: { prizeTokenAddress: Address; drawPeriodInSeconds: number; tierShares: number }
    }

    return new PrizePool(
      prizePoolInfo.chainId,
      prizePoolInfo.address,
      publicClient,
      prizePoolInfo.options
    )
  }, [chainId])

  const { refetch: refetchRngAuctionEvents } = useRngAuctionEvents()
  const { refetch: refetchRelayAuctionEvents } = useRelayAuctionEvents(prizePool)
  const { refetch: refetchDrawClosedEvents } = useDrawClosedEvents(prizePool)

  // Automatic data refetching
  useEffect(() => {
    const interval = setInterval(() => {
      refetchRngAuctionEvents()
      refetchRelayAuctionEvents()
      refetchDrawClosedEvents()
    }, sToMs(300))

    return () => clearInterval(interval)
  }, [])

  const drawIdSelected = useAtomValue(selectedDrawIdAtom)

  return (
    <div className={classNames('w-full flex flex-col gap-6 items-center', className)}>
      {!!drawIdSelected && <DrawStatusBadge prizePool={prizePool} drawId={drawIdSelected} />}
      {!!drawIdSelected && (
        <PrizesTable prizePool={prizePool} drawId={drawIdSelected} className='mt-6' />
      )}
      <DrawSelector prizePool={prizePool} />
    </div>
  )
}
