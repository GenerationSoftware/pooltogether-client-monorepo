import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useDrawIds } from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useState } from 'react'
import { DrawCard } from './DrawCard'

interface DrawCardsProps {
  prizePool: PrizePool
  className?: string
}

export const DrawCards = (props: DrawCardsProps) => {
  const { prizePool, className } = props

  const { data: drawIds } = useDrawIds(prizePool)

  const baseNumDraws = 5
  const [numDraws, setNumDraws] = useState<number>(4)

  if (!drawIds.length) {
    return <Spinner className='after:border-y-pt-purple-300' />
  }

  return (
    <div className={classNames('w-full flex flex-col gap-3 items-center', className)}>
      {[...drawIds]
        .reverse()
        .slice(0, numDraws)
        .map((drawId) => (
          <DrawCard
            key={`draw-${drawId}-${prizePool.chainId}`}
            prizePool={prizePool}
            drawId={drawId}
          />
        ))}
      {drawIds.length > numDraws && (
        <span
          onClick={() => setNumDraws(numDraws + baseNumDraws)}
          className='cursor-pointer text-pt-purple-200'
        >
          Show More Draws
        </span>
      )}
    </div>
  )
}
