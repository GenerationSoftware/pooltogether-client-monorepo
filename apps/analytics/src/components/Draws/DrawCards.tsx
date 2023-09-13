import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeDrawTimestamps } from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { PRIZE_POOLS } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
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

  // TODO: this should be refetched periodically to pick up new draws
  const { data: allDrawTimestamps, isFetched: isFetchedAllDrawTimestamps } =
    usePrizeDrawTimestamps(prizePool)

  if (!isFetchedAllDrawTimestamps || !allDrawTimestamps) {
    return <Spinner />
  }

  const lastDrawId = allDrawTimestamps[allDrawTimestamps.length - 1].id

  // TODO: should cap draws rendered in at once and add a "show more" at the bottom
  return (
    <div className={classNames('w-full flex flex-col gap-3 items-center', className)}>
      <DrawCard
        key={`draw-${lastDrawId + 1}-${chainId}`}
        prizePool={prizePool}
        drawId={lastDrawId + 1}
      />
      {[...allDrawTimestamps].reverse().map((draw) => (
        <DrawCard key={`draw-${draw.id}-${chainId}`} prizePool={prizePool} drawId={draw.id} />
      ))}
    </div>
  )
}
