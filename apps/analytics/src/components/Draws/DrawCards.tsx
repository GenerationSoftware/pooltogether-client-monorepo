import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useState } from 'react'
import { useRngTxs } from '@hooks/useRngTxs'
import { DrawCard } from './DrawCard'

interface DrawCardsProps {
  prizePool: PrizePool
  className?: string
}

export const DrawCards = (props: DrawCardsProps) => {
  const { prizePool, className } = props

  const { data: rngTxs, isFetched: isFetchedRngTxs } = useRngTxs(prizePool)

  const baseNumDraws = 5
  const [numDraws, setNumDraws] = useState<number>(4)

  if (!isFetchedRngTxs || !rngTxs) {
    return <Spinner className='after:border-y-pt-purple-800' />
  }

  const lastRngTxs = rngTxs[rngTxs.length - 1]
  const lastDrawId = lastRngTxs.rng.drawId

  return (
    <div className={classNames('w-full flex flex-col gap-3 items-center', className)}>
      {!!lastRngTxs.relay && (
        <DrawCard
          key={`draw-${lastDrawId + 1}-${prizePool.chainId}`}
          prizePool={prizePool}
          drawId={lastDrawId + 1}
        />
      )}
      {[...rngTxs]
        .reverse()
        .slice(0, numDraws)
        .map((txs) => (
          <DrawCard
            key={`draw-${txs.rng.drawId}-${prizePool.chainId}`}
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
