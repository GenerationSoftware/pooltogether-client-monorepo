import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeDrawWinners } from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { formatNumberForDisplay, sToMs } from '@shared/utilities'
import classNames from 'classnames'
import { ReactNode } from 'react'
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

  const { data: drawClosedEvents, isFetched: isFetchedDrawClosedEvents } =
    useDrawClosedEvents(prizePool)
  const drawClosedEvent = drawClosedEvents?.find((e) => e.args.drawId === drawId)
  const prevDrawClosedEvent = drawClosedEvents?.find((e) => e.args.drawId === drawId - 1)
  const numTiers = drawClosedEvent?.args.numTiers ?? prevDrawClosedEvent?.args.nextNumTiers

  const { data: prizesAvailable } = useDrawResults(prizePool, drawId, {
    refetchInterval: sToMs(300)
  })
  const nonCanaryPrizesAvailable =
    !!prizesAvailable && !!numTiers
      ? prizesAvailable.filter((prize) => prize.tier !== numTiers - 1)
      : []
  const canaryPrizesAvailable =
    !!prizesAvailable && !!numTiers
      ? prizesAvailable.filter((prize) => prize.tier === numTiers - 1)
      : []

  const { data: allDraws } = usePrizeDrawWinners(prizePool)
  const draw = allDraws?.find((d) => d.id === drawId)
  const nonCanaryPrizeClaims =
    !!draw && !!numTiers ? draw.prizeClaims.filter((prize) => prize.tier !== numTiers - 1) : []
  const canaryPrizeClaims =
    !!draw && !!numTiers ? draw.prizeClaims.filter((prize) => prize.tier === numTiers - 1) : []

  const formattedCanaryPercentage =
    !!canaryPrizeClaims.length && !!canaryPrizesAvailable.length
      ? formatNumberForDisplay((canaryPrizeClaims.length / canaryPrizesAvailable.length) * 100, {
          maximumFractionDigits: 0
        })
      : undefined

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <DrawCardItemTitle>Prizes</DrawCardItemTitle>
      <div className='flex flex-col gap-1 text-sm text-pt-purple-700 whitespace-nowrap'>
        {isFetchedDrawClosedEvents ? (
          <span>
            <BigText>{numTiers ?? '?'}</BigText> tiers
          </span>
        ) : (
          <Spinner className='after:border-y-pt-purple-800' />
        )}
        {!!nonCanaryPrizesAvailable.length && (
          <span>
            <BigText>{nonCanaryPrizesAvailable.length}</BigText> prizes
          </span>
        )}
        {!!nonCanaryPrizeClaims.length && (
          <span>
            <BigText>{nonCanaryPrizeClaims.length}</BigText> claimed
          </span>
        )}
        {!!formattedCanaryPercentage && (
          <span>
            <BigText>+{formattedCanaryPercentage}%</BigText> canary
          </span>
        )}
      </div>
    </div>
  )
}

const BigText = (props: { children: ReactNode }) => (
  <span className='text-xl font-semibold'>{props.children}</span>
)
