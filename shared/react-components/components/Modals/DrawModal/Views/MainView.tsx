import { PrizePool } from '@pooltogether/hyperstructure-client-js'
import { usePrizeTokenData } from '@pooltogether/hyperstructure-react-hooks'
import { Intl, SubgraphDraw } from '@shared/types'
import { ExternalLink, Spinner } from '@shared/ui'
import {
  formatBigIntForDisplay,
  getBlockExplorerUrl,
  shorten,
  sortByBigIntDesc,
  sToMs
} from '@shared/utilities'
import { PrizePoolBadge } from '../../../Badges/PrizePoolBadge'

interface MainViewProps {
  draw: SubgraphDraw
  prizePool: PrizePool
  intl?: { base?: Intl<'prizePool' | 'drawId'>; prizes?: Intl<'drawTotal' | 'winner' | 'prize'> }
}

export const MainView = (props: MainViewProps) => {
  const { draw, prizePool, intl } = props

  return (
    <div className='flex flex-col gap-6 mb-6'>
      <MainViewHeader draw={draw} intl={intl?.base} />
      <PrizePoolBadge chainId={prizePool.chainId} intl={intl?.base} className='mx-auto' />
      {/* TODO: add "you were eligible for this draw" message when applicable */}
      <DrawTotals draw={draw} prizePool={prizePool} intl={intl?.prizes} />
      <DrawWinnersTable draw={draw} prizePool={prizePool} intl={intl?.prizes} />
    </div>
  )
}

interface MainViewHeaderProps {
  draw: SubgraphDraw
  intl?: Intl<'drawId'>
}

const MainViewHeader = (props: MainViewHeaderProps) => {
  const { draw, intl } = props

  const drawDate = new Date(sToMs(draw.prizeClaims[0].timestamp))
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
      <span className='text-xl font-semibold'>
        {intl?.('drawId', { id: draw.id }) ?? `Draw #${draw.id}`}
      </span>
      <span className='text-sm text-pt-purple-200'>{formattedDrawDate}</span>
    </div>
  )
}

interface DrawTotalsProps {
  draw: SubgraphDraw
  prizePool: PrizePool
  intl?: Intl<'drawTotal'>
}

const DrawTotals = (props: DrawTotalsProps) => {
  const { draw, prizePool, intl } = props

  const { data: tokenData } = usePrizeTokenData(prizePool)

  const totalPrizeAmount = draw.prizeClaims.reduce((a, b) => a + b.payout, 0n)
  const formattedTotalPrizeAmount = !!tokenData
    ? formatBigIntForDisplay(totalPrizeAmount, tokenData.decimals, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    : undefined

  if (formattedTotalPrizeAmount === undefined) {
    return <Spinner />
  }

  return (
    <span className='text-center'>
      {intl?.('drawTotal', {
        numPrizes: draw.prizeClaims.length,
        numTokens: `${
          formattedTotalPrizeAmount === '0.00' ? '< 0.01' : formattedTotalPrizeAmount
        } ${tokenData?.symbol}`
      }) ??
        `This draw had ${draw.prizeClaims.length} prizes totalling ${
          formattedTotalPrizeAmount === '0.00' ? '< 0.01' : formattedTotalPrizeAmount
        } ${tokenData?.symbol}.`}
    </span>
  )
}

interface DrawWinnersTableProps {
  draw: SubgraphDraw
  prizePool: PrizePool
  intl?: Intl<'winner' | 'prize'>
}

// TODO: highlight grand prizes
const DrawWinnersTable = (props: DrawWinnersTableProps) => {
  const { draw, prizePool, intl } = props

  const { data: tokenData } = usePrizeTokenData(prizePool)

  return (
    <div className='flex flex-col w-full gap-2 md:text-center'>
      <div className='flex w-full text-pt-purple-100 font-semibold'>
        <span className='w-1/2'>{intl?.('winner') ?? 'Winner'}</span>
        <span className='w-1/2 text-right md:text-center'>{intl?.('prize') ?? 'Prize'}</span>
      </div>
      {!!draw && !!tokenData ? (
        <div className='flex flex-col w-full max-h-52 gap-3 overflow-y-auto'>
          {draw.prizeClaims
            .sort((a, b) => sortByBigIntDesc(a.payout, b.payout))
            .map((prize) => {
              const formattedPrize = formatBigIntForDisplay(prize.payout, tokenData.decimals, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })

              return (
                <div key={prize.id} className='flex w-full items-center'>
                  <span className='w-1/2'>
                    <ExternalLink
                      href={getBlockExplorerUrl(prizePool.chainId, prize.winner, 'address')}
                      text={shorten(prize.winner, { short: true }) as string}
                    />
                  </span>
                  <span className='w-1/2 text-right whitespace-nowrap md:text-center'>
                    {!!tokenData ? (
                      `${formattedPrize === '0.00' ? '< 0.01' : formattedPrize} ${tokenData.symbol}`
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
