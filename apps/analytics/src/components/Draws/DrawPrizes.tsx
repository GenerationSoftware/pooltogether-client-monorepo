import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  usePrizeDrawWinners,
  usePrizePoolDrawAwardedEvents
} from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { formatNumberForDisplay, sToMs } from '@shared/utilities'
import classNames from 'classnames'
import { ReactNode, useMemo } from 'react'
import { isCanaryTier } from 'src/utils'
import { QUERY_START_BLOCK } from '@constants/config'
import { useDrawResults } from '@hooks/useDrawResults'
import { DrawCardItemTitle } from './DrawCardItemTitle'

interface DrawPrizesProps {
  prizePool: PrizePool
  drawId: number
  className?: string
}

export const DrawPrizes = (props: DrawPrizesProps) => {
  const { prizePool, drawId, className } = props

  const { data: drawAwardedEvents, isFetched: isFetchedDrawAwardedEvents } =
    usePrizePoolDrawAwardedEvents(prizePool, {
      fromBlock: !!prizePool ? QUERY_START_BLOCK[prizePool.chainId] : undefined
    })

  const numTiers = useMemo(() => {
    const drawAwardedEvent = drawAwardedEvents?.find((e) => e.args.drawId === drawId)
    return drawAwardedEvent?.args.numTiers
  }, [drawId, drawAwardedEvents])

  const { data: prizesAvailable } = useDrawResults(prizePool, drawId, {
    refetchInterval: sToMs(300)
  })
  const nonCanaryPrizesAvailable =
    !!prizesAvailable && !!numTiers
      ? prizesAvailable.filter((prize) => !isCanaryTier(prize.tier, numTiers))
      : []
  const canaryPrizesAvailable =
    !!prizesAvailable && !!numTiers
      ? prizesAvailable.filter((prize) => isCanaryTier(prize.tier, numTiers))
      : []

  const { data: allDraws, isFetched: isFetchedPrizeDrawWinners } = usePrizeDrawWinners(prizePool)
  const draw = allDraws?.find((d) => d.id === drawId)
  const nonCanaryPrizeClaims =
    !!draw && !!numTiers
      ? draw.prizeClaims.filter((prize) => !isCanaryTier(prize.tier, numTiers))
      : []
  const canaryPrizeClaims =
    !!draw && !!numTiers
      ? draw.prizeClaims.filter((prize) => isCanaryTier(prize.tier, numTiers))
      : []

  const formattedCanaryPercentage =
    !!canaryPrizeClaims.length && !!canaryPrizesAvailable.length
      ? formatNumberForDisplay((canaryPrizeClaims.length / canaryPrizesAvailable.length) * 100, {
          maximumFractionDigits: 0
        })
      : undefined

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <DrawCardItemTitle>Prizes</DrawCardItemTitle>
      <div className='flex flex-col gap-1 text-sm text-pt-purple-200 whitespace-nowrap'>
        {isFetchedDrawAwardedEvents && isFetchedPrizeDrawWinners ? (
          <>
            {!!numTiers ? (
              <span>
                <BigText>{numTiers}</BigText> tiers
              </span>
            ) : (
              <span>-</span>
            )}
            {!!nonCanaryPrizesAvailable.length && (
              <span>
                <BigText>{nonCanaryPrizesAvailable.length}</BigText> prize
                {nonCanaryPrizesAvailable.length > 1 && 's'}
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
          </>
        ) : (
          <Spinner className='after:border-y-pt-purple-300' />
        )}
      </div>
    </div>
  )
}

const BigText = (props: { children: ReactNode }) => (
  <span className='text-xl font-semibold'>{props.children}</span>
)
