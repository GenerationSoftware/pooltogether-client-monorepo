import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useAllUserEligibleDraws,
  useLastDrawId,
  useLastDrawTimestamps,
  usePrizeTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { Intl, SubgraphDraw } from '@shared/types'
import { ExternalLink, Spinner } from '@shared/ui'
import {
  formatBigIntForDisplay,
  getBlockExplorerUrl,
  shorten,
  sortByBigIntDesc,
  sToMs
} from '@shared/utilities'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { PrizePoolBadge } from '../../../Badges/PrizePoolBadge'
import { TokenValue } from '../../../Currency/TokenValue'

interface MainViewProps {
  draw: SubgraphDraw
  prizePool: PrizePool
  intl?: {
    base?: Intl<'prizePool' | 'drawId'>
    prizes?: Intl<
      | 'drawTotal.beforeValue'
      | 'drawTotal.afterValue'
      | 'drawTotal.afterValueOngoing'
      | 'winner'
      | 'prize'
      | 'youWereEligible'
    >
  }
}

export const MainView = (props: MainViewProps) => {
  const { draw, prizePool, intl } = props

  return (
    <div className='flex flex-col gap-6 mb-6'>
      <MainViewHeader draw={draw} intl={intl?.base} />
      <PrizePoolBadge chainId={prizePool.chainId} intl={intl?.base} className='mx-auto' />
      <EligibilityInfo draw={draw} prizePool={prizePool} intl={intl?.prizes} />
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

interface EligibilityInfoProps {
  draw: SubgraphDraw
  prizePool: PrizePool
  intl?: Intl<'youWereEligible'>
}

const EligibilityInfo = (props: EligibilityInfoProps) => {
  const { draw, prizePool, intl } = props

  const { address: userAddress } = useAccount()

  const { data: allUserEligibleDraws } = useAllUserEligibleDraws(
    [prizePool],
    userAddress as Address
  )

  const isEligible = useMemo(() => {
    const eligibleDraws =
      allUserEligibleDraws?.eligibleDraws[prizePool.chainId]?.map((draw) => draw.id) ?? []
    return eligibleDraws.includes(draw.id)
  }, [userAddress, allUserEligibleDraws])

  if (!!userAddress && isEligible) {
    return (
      <span className='text-center font-semibold text-pt-teal'>
        {intl?.('youWereEligible') ?? `You were eligible for this draw.`}
      </span>
    )
  }

  return <></>
}

interface DrawTotalsProps {
  draw: SubgraphDraw
  prizePool: PrizePool
  intl?: Intl<'drawTotal.beforeValue' | 'drawTotal.afterValue' | 'drawTotal.afterValueOngoing'>
}

const DrawTotals = (props: DrawTotalsProps) => {
  const { draw, prizePool, intl } = props

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  const { data: lastDrawId } = useLastDrawId(prizePool)
  const { data: lastDrawTimestamps } = useLastDrawTimestamps(prizePool)

  const isOngoing = useMemo(() => {
    if (!!lastDrawId && draw.id === lastDrawId && !!lastDrawTimestamps) {
      const currentTime = Date.now() / 1_000
      const drawPeriod = lastDrawTimestamps.end - lastDrawTimestamps.start
      const drawFinalizedTimestamp = lastDrawTimestamps.end + drawPeriod
      return drawFinalizedTimestamp > currentTime
    }
  }, [lastDrawId, lastDrawTimestamps])

  if (prizeToken === undefined) {
    return <Spinner />
  }

  const uniqueWallets = new Set<Address>(draw.prizeClaims.map((claim) => claim.winner))
  const totalPrizeAmount = draw.prizeClaims.reduce((a, b) => a + b.payout, 0n)

  return (
    <span className='inline-flex gap-x-[0.5ch] justify-center text-center'>
      <span>
        {intl?.('drawTotal.beforeValue', { numWallets: uniqueWallets.size }) ??
          `This draw had ${uniqueWallets.size} unique wallets winning a total of`}
      </span>
      <span>
        <TokenValue token={{ ...prizeToken, amount: totalPrizeAmount }} />
      </span>
      {isOngoing ? (
        <span>{intl?.('drawTotal.afterValueOngoing') ?? `in prizes so far.`}</span>
      ) : (
        <span>{intl?.('drawTotal.afterValue') ?? `in prizes.`}</span>
      )}
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
          {[...draw.prizeClaims]
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
                    >
                      {shorten(prize.winner, { short: true }) as string}
                    </ExternalLink>
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
