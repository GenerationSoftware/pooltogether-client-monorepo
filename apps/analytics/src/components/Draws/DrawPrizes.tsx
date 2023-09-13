import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeDrawWinners } from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useMemo } from 'react'
import { DrawCardItemTitle } from './DrawCardItemTitle'

interface DrawPrizesProps {
  prizePool: PrizePool
  drawId: number
  className?: string
}

export const DrawPrizes = (props: DrawPrizesProps) => {
  const { prizePool, drawId, className } = props

  const { data: allDraws, isFetched: isFetchedAllDraws } = usePrizeDrawWinners(prizePool)
  const draw = allDraws?.find((d) => d.id === drawId)

  const numTiers = 4 // TODO: this should come from the `draw` object once available on the subgraph

  const numPrizes = 48 // TODO: this should be fetched from the github draw results

  const numPrizesClaimed = useMemo(() => {
    if (!!draw) {
      return draw.prizeClaims.filter((prize) => prize.tier < numTiers - 1).length
    }
  }, [draw])

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <DrawCardItemTitle>Prizes</DrawCardItemTitle>
      <div className='flex flex-col gap-1 text-sm text-pt-purple-700'>
        {!!draw ? (
          <>
            <span>
              <span className='text-xl font-semibold'>{numTiers}</span> tiers
            </span>
            <span>
              <span className='text-xl font-semibold'>{numPrizes}</span> prizes
            </span>
            <span>
              <span className='text-xl font-semibold'>{numPrizesClaimed}</span> claimed
            </span>
          </>
        ) : isFetchedAllDraws ? (
          <span>-</span>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  )
}
