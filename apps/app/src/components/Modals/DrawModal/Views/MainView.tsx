import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useAllUserEligibleDraws,
  useLastAwardedDrawId,
  useLastAwardedDrawTimestamps,
  usePrizeTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { PrizePoolBadge, TokenValue } from '@shared/react-components'
import { SubgraphDraw } from '@shared/types'
import { Spinner } from '@shared/ui'
import { formatBigIntForDisplay, lower, shorten, sortByBigIntDesc, sToMs } from '@shared/utilities'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { WALLET_NAMES } from '@constants/config'

interface MainViewProps {
  draw: SubgraphDraw
  prizePool: PrizePool
}

export const MainView = (props: MainViewProps) => {
  const { draw, prizePool } = props

  const t_common = useTranslations('Common')

  return (
    <div className='flex flex-col gap-6 mb-6'>
      <MainViewHeader draw={draw} />
      <PrizePoolBadge chainId={prizePool.chainId} intl={t_common} className='mx-auto' />
      <EligibilityInfo draw={draw} prizePool={prizePool} />
      <DrawTotals draw={draw} prizePool={prizePool} />
      <DrawWinnersTable draw={draw} prizePool={prizePool} />
    </div>
  )
}

interface MainViewHeaderProps {
  draw: SubgraphDraw
}

const MainViewHeader = (props: MainViewHeaderProps) => {
  const { draw } = props

  const t_common = useTranslations('Common')

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
      <span className='text-xl font-semibold'>{t_common('drawId', { id: draw.id })}</span>
      <span className='text-sm text-pt-purple-200'>{formattedDrawDate}</span>
    </div>
  )
}

interface EligibilityInfoProps {
  draw: SubgraphDraw
  prizePool: PrizePool
}

const EligibilityInfo = (props: EligibilityInfoProps) => {
  const { draw, prizePool } = props

  const t = useTranslations('Prizes.drawModal')

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
    return <span className='text-center font-semibold text-pt-teal'>{t('youWereEligible')}</span>
  }

  return <></>
}

interface DrawTotalsProps {
  draw: SubgraphDraw
  prizePool: PrizePool
}

const DrawTotals = (props: DrawTotalsProps) => {
  const { draw, prizePool } = props

  const t = useTranslations('Prizes.drawModal')

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  const { data: lastDrawId } = useLastAwardedDrawId(prizePool)
  const { data: lastDrawTimestamps } = useLastAwardedDrawTimestamps(prizePool)

  const isOngoing = useMemo(() => {
    if (!!lastDrawId && draw.id === lastDrawId && !!lastDrawTimestamps) {
      const currentTime = Date.now() / 1_000
      const drawPeriod = lastDrawTimestamps.closedAt - lastDrawTimestamps.openedAt
      const drawFinalizedTimestamp = lastDrawTimestamps.closedAt + drawPeriod
      return drawFinalizedTimestamp > currentTime
    }
  }, [lastDrawId, lastDrawTimestamps])

  const { uniqueWallets, totalPrizeAmount } = useMemo(() => {
    const validPrizeClaims = draw.prizeClaims.filter((claim) => !!claim.payout)

    return {
      uniqueWallets: new Set<Address>(validPrizeClaims.map((claim) => claim.winner)),
      totalPrizeAmount: validPrizeClaims.reduce((a, b) => a + b.payout, 0n)
    }
  }, [draw])

  if (prizeToken === undefined) {
    return <Spinner />
  }

  return (
    <span className='text-center'>
      {t('drawTotal.beforeValue', { numWallets: uniqueWallets.size })}{' '}
      <TokenValue token={{ ...prizeToken, amount: totalPrizeAmount }} />{' '}
      {isOngoing
        ? t('drawTotal.afterValueOngoing') ?? `in prizes so far.`
        : t('drawTotal.afterValue') ?? `in prizes.`}
    </span>
  )
}

interface DrawWinnersTableProps {
  draw: SubgraphDraw
  prizePool: PrizePool
}

// TODO: highlight grand prizes
const DrawWinnersTable = (props: DrawWinnersTableProps) => {
  const { draw, prizePool } = props

  const t = useTranslations('Prizes.drawModal')

  const { data: tokenData } = usePrizeTokenData(prizePool)

  const wins = useMemo(() => {
    const groupedWins: { [winner: Address]: bigint } = {}

    const validPrizeClaims = draw.prizeClaims.filter((claim) => !!claim.payout)

    validPrizeClaims.forEach((win) => {
      if (groupedWins[win.winner] !== undefined) {
        groupedWins[win.winner] += win.payout
      } else {
        groupedWins[win.winner] = win.payout
      }
    })

    return Object.entries(groupedWins).sort((a, b) => sortByBigIntDesc(a[1], b[1]))
  }, [draw])

  return (
    <div className='flex flex-col w-full gap-2 md:text-center'>
      <div className='flex w-full text-pt-purple-100 font-semibold'>
        <span className='w-1/2'>{t('winner')}</span>
        <span className='w-1/2 text-right md:text-center'>{t('prize')}</span>
      </div>
      {!!tokenData ? (
        <div className='flex flex-col w-full max-h-52 gap-3 overflow-y-auto'>
          {wins.map((win) => {
            const winner = win[0] as Address

            const formattedPrize = formatBigIntForDisplay(win[1], tokenData.decimals, {
              minimumFractionDigits: 4,
              maximumFractionDigits: 4
            })

            return (
              <div key={`prize-${winner}`} className='flex w-full items-center'>
                <span className='w-1/2'>
                  <Link href={`/account/${winner}`}>
                    <button className='hover:text-pt-purple-100'>
                      {WALLET_NAMES[lower(winner)]?.name ?? shorten(winner)}
                    </button>
                  </Link>
                </span>
                <span className='w-1/2 text-right whitespace-nowrap md:text-center'>
                  {formattedPrize === '0.0000' ? '< 0.0001' : formattedPrize} {tokenData.symbol}
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
