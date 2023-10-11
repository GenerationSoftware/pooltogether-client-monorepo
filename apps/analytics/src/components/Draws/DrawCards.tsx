import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useDrawPeriod, useFirstDrawOpenedAt } from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useMemo, useState } from 'react'
import { currentTimestampAtom } from 'src/atoms'
import { DrawCard } from './DrawCard'

interface DrawCardsProps {
  prizePool: PrizePool
  className?: string
}

export const DrawCards = (props: DrawCardsProps) => {
  const { prizePool, className } = props

  const { data: firstDrawOpenedAt } = useFirstDrawOpenedAt(prizePool)

  const { data: drawPeriod } = useDrawPeriod(prizePool)

  const currentTimestamp = useAtomValue(currentTimestampAtom)

  const allDrawIds = useMemo(() => {
    const drawIds: number[] = []
    if (!!firstDrawOpenedAt && !!drawPeriod) {
      for (let i = firstDrawOpenedAt; i < currentTimestamp; i += drawPeriod) {
        drawIds.push(drawIds.length + 1)
      }
    }
    return drawIds
  }, [firstDrawOpenedAt, drawPeriod, currentTimestamp])

  const baseNumDraws = 5
  const [numDraws, setNumDraws] = useState<number>(4)

  if (!firstDrawOpenedAt || !drawPeriod) {
    return <Spinner className='after:border-y-pt-purple-800' />
  }

  return (
    <div className={classNames('w-full flex flex-col gap-3 items-center', className)}>
      {[...allDrawIds]
        .reverse()
        .slice(0, numDraws)
        .map((drawId) => (
          <DrawCard
            key={`draw-${drawId}-${prizePool.chainId}`}
            prizePool={prizePool}
            drawId={drawId}
          />
        ))}
      {allDrawIds.length > numDraws && (
        <span onClick={() => setNumDraws(numDraws + baseNumDraws)} className='cursor-pointer'>
          Show More Draws
        </span>
      )}
    </div>
  )
}
