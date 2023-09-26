import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  usePrizeDrawWinners,
  usePrizeTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { sToMs } from '@shared/utilities'
import classNames from 'classnames'
import Image from 'next/image'
import { useDrawClosedEvents } from '@hooks/useDrawClosedEvents'
import { useDrawResults } from '@hooks/useDrawResults'
import { useDrawStatus } from '@hooks/useDrawStatus'
import { PrizesTableRow } from './PrizesTableRow'

interface PrizesTableProps {
  prizePool: PrizePool
  drawId: number
  className?: string
}

export const PrizesTable = (props: PrizesTableProps) => {
  const { prizePool, drawId, className } = props

  const { data: wins, isFetched: isFetchedWins } = usePrizeDrawWinners(prizePool)
  const drawWins = wins?.find((draw) => draw.id === drawId)?.prizeClaims

  const { closedAt, isFetched: isFetchedDrawStatus } = useDrawStatus(prizePool, drawId)

  const { data: prizes, isFetched: isFetchedPrizes } = useDrawResults(prizePool, drawId, {
    refetchInterval: sToMs(300)
  })

  const { data: drawClosedEvents, isFetched: isFetchedDrawClosedEvents } =
    useDrawClosedEvents(prizePool)
  const drawClosedEvent = drawClosedEvents?.find((e) => e.args.drawId === drawId)
  const prevDrawClosedEvent = drawClosedEvents?.find((e) => e.args.drawId === drawId - 1)
  const numTiers = drawClosedEvent?.args.numTiers ?? prevDrawClosedEvent?.args.nextNumTiers ?? 0

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  if (
    !isFetchedWins ||
    !isFetchedDrawStatus ||
    !isFetchedPrizes ||
    !prizeToken ||
    !isFetchedDrawClosedEvents
  ) {
    return <Spinner className='after:border-y-pt-purple-800' />
  }

  if (!drawWins || !closedAt) {
    return (
      <span className='flex gap-2 items-center'>
        No claims so far... <Image src='/thinkies.png' width={24} height={24} alt='thinkies' />
      </span>
    )
  }

  const gridClassName =
    'w-full grid gap-12 grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,3fr)_minmax(0,3fr)_minmax(0,3fr)] px-4'

  return (
    <div className={classNames('w-full flex flex-col gap-2 items-center', className)}>
      <PrizesTableHeaders className={gridClassName} />
      <div className='w-full h-[50vh] flex flex-col grow gap-2 items-center overflow-auto'>
        {[...Array(numTiers).keys()].map((tier) => (
          <PrizesTableRow
            key={`prizesTier-${tier}`}
            prizePool={prizePool}
            drawId={drawId}
            wins={drawWins}
            tier={tier}
            numTiers={numTiers}
            closedAt={closedAt}
            prizes={prizes}
            prizeToken={prizeToken}
            className={gridClassName}
          />
        ))}
      </div>
    </div>
  )
}

interface PrizesTableHeadersProps {
  className?: string
}

const PrizesTableHeaders = (props: PrizesTableHeadersProps) => {
  const { className } = props

  return (
    <div className={classNames('text-sm text-pt-purple-400', className)}>
      <span>Tier</span>
      <span>Prize Size</span>
      <span>Prizes Claimed</span>
      <span>Claim Fees</span>
      <span>Claim Time</span>
    </div>
  )
}
