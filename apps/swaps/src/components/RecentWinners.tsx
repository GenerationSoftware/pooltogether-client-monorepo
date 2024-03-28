import {
  usePrizeDrawWinners,
  usePrizePool,
  usePrizeTokenPrice
} from '@generationsoftware/hyperstructure-react-hooks'
import { CurrencyValue } from '@shared/react-components'
import { SubgraphDraw, TokenWithPrice } from '@shared/types'
import { ExternalLink, LINKS, Spinner } from '@shared/ui'
import { getSecondsSinceEpoch, PRIZE_POOLS, SECONDS_PER_DAY, shorten } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'
import { formatUnits } from 'viem'
import { MIN_BIG_WIN } from '@constants/config'

interface RecentWinnersProps {
  chainId: number
  className?: string
}

export const RecentWinners = (props: RecentWinnersProps) => {
  const { chainId, className } = props

  const prizePoolInfo = PRIZE_POOLS.find(
    (pool) => pool.chainId === chainId
  ) as (typeof PRIZE_POOLS)[number]
  const prizePool = usePrizePool(chainId, prizePoolInfo.address, prizePoolInfo.options)
  const { data: winners } = usePrizeDrawWinners(prizePool)
  const { data: prizeToken } = usePrizeTokenPrice(prizePool)

  const highlightedWins = useMemo(() => {
    const flattenedWins: SubgraphDraw['prizeClaims'] = []
    winners?.forEach((draw) => flattenedWins.push(...draw.prizeClaims))

    if (!!flattenedWins.length) {
      const winsByTimestamp = [...flattenedWins].sort((a, b) => b.timestamp - a.timestamp)

      const filteredWins = winsByTimestamp.filter((win) => win.payout >= MIN_BIG_WIN)

      return filteredWins.slice(0, 4)
    } else {
      return []
    }
  }, [winners])

  return (
    <div
      className={classNames(
        'w-full flex flex-col gap-[10px] items-center text-center p-12 rounded-lg',
        'bg-pt-purple-50/5',
        className
      )}
    >
      <span className='font-grotesk font-semibold text-5xl text-pt-pink'>Recent Big Wins</span>
      {!!prizeToken && !!highlightedWins.length ? (
        highlightedWins.map((win) => (
          <Win key={`win-${win.id}`} win={win} prizeToken={prizeToken} />
        ))
      ) : (
        <Spinner />
      )}
      <ExternalLink
        href={`${LINKS.app}/prizes?network=${chainId}`}
        size='lg'
        className='text-pt-pink'
      >
        See more winners
      </ExternalLink>
    </div>
  )
}

interface WinProps {
  win: SubgraphDraw['prizeClaims'][0]
  prizeToken: TokenWithPrice
  className?: string
}

const Win = (props: WinProps) => {
  const { win, prizeToken, className } = props

  const winner = shorten(win.winner, { short: true })
  const prize = parseFloat(formatUnits(win.payout, prizeToken.decimals)) * (prizeToken.price ?? 0)

  const currentTime = getSecondsSinceEpoch()
  const daysAgo = Math.floor((currentTime - win.timestamp) / SECONDS_PER_DAY)
  const timeText = daysAgo > 1 ? `${daysAgo} days ago` : daysAgo === 1 ? 'yesterday' : 'today'

  return (
    <span
      className={classNames(
        'inline-flex gap-2 font-grotesk text-2xl text-pt-purple-100',
        className
      )}
    >
      <span>{winner} won</span>{' '}
      <span className='text-pt-pink'>
        <CurrencyValue baseValue={prize} hideZeroes={true} />
      </span>{' '}
      <span className='hidden md:block'>{timeText}</span>
    </span>
  )
}
