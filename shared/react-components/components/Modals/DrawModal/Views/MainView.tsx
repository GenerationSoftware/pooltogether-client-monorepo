import {
  formatBigIntForDisplay,
  getBlockExplorerUrl,
  PrizePool,
  shorten,
  sortByBigIntDesc,
  SubgraphPrizePoolDraw
} from '@pooltogether/hyperstructure-client-js'
import { usePrizeTokenData } from '@pooltogether/hyperstructure-react-hooks'
import { ExternalLink, Spinner } from '@shared/ui'
import { NetworkBadge } from '../../../Badges/NetworkBadge'

interface MainViewProps {
  draw: SubgraphPrizePoolDraw
  prizePool: PrizePool
}

export const MainView = (props: MainViewProps) => {
  const { draw, prizePool } = props

  return (
    <div className='flex flex-col gap-6 mb-6'>
      <MainViewHeader draw={draw} />
      <NetworkBadge chainId={prizePool.chainId} appendText='Prize Pool' className='mx-auto' />
      {/* TODO: add "you were eligible for this draw" message when applicable */}
      <DrawTotals draw={draw} prizePool={prizePool} />
      <DrawWinnersTable draw={draw} prizePool={prizePool} />
    </div>
  )
}

interface MainViewHeaderProps {
  draw: SubgraphPrizePoolDraw
}

const MainViewHeader = (props: MainViewHeaderProps) => {
  const { draw } = props

  const drawDate = new Date(parseInt(draw.prizeClaims[0].timestamp) * 1_000)
  const formattedDrawDate = drawDate.toLocaleTimeString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
    timeZoneName: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className='flex flex-col mx-auto text-center'>
      <span className='text-xl font-semibold'>Draw #{draw.id}</span>
      <span className='text-sm text-pt-purple-200'>{formattedDrawDate}</span>
    </div>
  )
}

interface DrawTotalsProps {
  draw: SubgraphPrizePoolDraw
  prizePool: PrizePool
}

const DrawTotals = (props: DrawTotalsProps) => {
  const { draw, prizePool } = props

  const { data: tokenData } = usePrizeTokenData(prizePool)

  const totalPrizeAmount = draw.prizeClaims.reduce((a, b) => a + BigInt(b.payout), 0n)
  const formattedTotalPrizeAmount = !!tokenData
    ? formatBigIntForDisplay(totalPrizeAmount, tokenData.decimals)
    : undefined

  return (
    <span className='text-center'>
      This draw had {draw.prizeClaims.length} prizes totalling{' '}
      {!!formattedTotalPrizeAmount ? (
        `${formattedTotalPrizeAmount} ${tokenData?.symbol}.`
      ) : (
        <Spinner />
      )}
    </span>
  )
}

interface DrawWinnersTableProps {
  draw: SubgraphPrizePoolDraw
  prizePool: PrizePool
}

const DrawWinnersTable = (props: DrawWinnersTableProps) => {
  const { draw, prizePool } = props

  const { data: tokenData } = usePrizeTokenData(prizePool)

  return (
    <div className='flex flex-col w-full gap-2 md:text-center'>
      {/* TODO: make sure table headers are aligned with content when scrollbar is active */}
      <div className='flex w-full text-pt-purple-100 font-semibold'>
        <span className='flex-grow'>Winner</span>
        <span className='flex-grow text-right md:text-center'>Prize</span>
      </div>
      {!!draw && !!tokenData ? (
        <div className='flex flex-col w-full max-h-52 gap-3 overflow-y-auto'>
          {draw.prizeClaims
            .sort((a, b) => sortByBigIntDesc(BigInt(a.payout), BigInt(b.payout)))
            .map((prize) => {
              return (
                <div key={prize.id} className='flex w-full items-center'>
                  <span className='flex-grow'>
                    <ExternalLink
                      href={getBlockExplorerUrl(prizePool.chainId, prize.winner.id, 'address')}
                      text={shorten(prize.winner.id, { short: true }) as string}
                    />
                  </span>
                  <span className='flex-grow text-right whitespace-nowrap md:text-center'>
                    {!!tokenData ? (
                      `${formatBigIntForDisplay(BigInt(prize.payout), tokenData.decimals)} ${
                        tokenData.symbol
                      }`
                    ) : (
                      <Spinner />
                    )}
                  </span>
                </div>
              )
            })}
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  )
}
