import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeDrawWinners } from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { sToMs } from '@shared/utilities'
import classNames from 'classnames'
import { useDrawClosedEvents } from '@hooks/useDrawClosedEvents'
import { useDrawResults } from '@hooks/useDrawResults'
import { DrawCardItemTitle } from './DrawCardItemTitle'

interface DrawPrizesProps {
  prizePool: PrizePool
  drawId: number
  className?: string
}

export const DrawPrizes = (props: DrawPrizesProps) => {
  const { prizePool, drawId, className } = props

  const { data: prizesAvailable, isFetched: isFetchedPrizesAvailable } = useDrawResults(
    prizePool,
    drawId,
    { refetchInterval: sToMs(300) }
  )

  const { data: allDraws, isFetched: isFetchedAllDraws } = usePrizeDrawWinners(prizePool)
  const draw = allDraws?.find((d) => d.id === drawId)

  const { data: drawClosedEvents, isFetched: isFetchedDrawClosedEvents } =
    useDrawClosedEvents(prizePool)
  const drawClosedEvent = drawClosedEvents?.find((e) => e.args.drawId === drawId)

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <DrawCardItemTitle>Prizes</DrawCardItemTitle>
      <div className='flex flex-col gap-1 text-sm text-pt-purple-700 whitespace-nowrap'>
        {!!prizesAvailable?.length || !!draw?.prizeClaims.length ? (
          <>
            {isFetchedDrawClosedEvents ? (
              <span>
                <span className='text-xl font-semibold'>
                  {drawClosedEvent?.args.numTiers ?? '?'}
                </span>{' '}
                tiers
              </span>
            ) : (
              <Spinner className='after:border-y-pt-purple-800' />
            )}
            <span>
              <span className='text-xl font-semibold'>
                {isFetchedPrizesAvailable ? (
                  prizesAvailable?.length ?? '?'
                ) : (
                  <Spinner className='after:border-y-pt-purple-800' />
                )}
              </span>{' '}
              prizes
            </span>
            <span>
              <span className='text-xl font-semibold'>
                {isFetchedAllDraws ? (
                  draw?.prizeClaims.length ?? 0
                ) : (
                  <Spinner className='after:border-y-pt-purple-800' />
                )}
              </span>{' '}
              claimed
            </span>
          </>
        ) : isFetchedAllDraws && isFetchedPrizesAvailable ? (
          <span>-</span>
        ) : (
          <Spinner className='after:border-y-pt-purple-800' />
        )}
      </div>
    </div>
  )
}
