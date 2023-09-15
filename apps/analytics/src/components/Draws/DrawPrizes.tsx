import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeDrawWinners } from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'
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

  const numPrizes = '?' // TODO: this should be fetched from the github draw results

  const numPrizesClaimed = draw?.prizeClaims.length // TODO: hide canary tiers once numTiers is available on subgraph

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <DrawCardItemTitle>Prizes</DrawCardItemTitle>
      <div className='flex flex-col gap-1 text-sm text-pt-purple-700'>
        {!!draw ? (
          <>
            <span>
              {/* TODO: show numTiers once available */}
              <span className='text-xl font-semibold'>?</span> tiers
              {/* <span className='text-xl font-semibold'>{draw.numTiers}</span> tiers */}
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
