import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  usePrizeDrawWinners,
  usePrizeTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { SubgraphDraw, Token } from '@shared/types'
import { Spinner } from '@shared/ui'
import { formatBigIntForDisplay, sToMs } from '@shared/utilities'
import classNames from 'classnames'
import Image from 'next/image'
import { ClaimFees } from '@components/ClaimFees'
import { useDrawResults } from '@hooks/useDrawResults'
import { useDrawStatus } from '@hooks/useDrawStatus'

interface PrizesTableProps {
  prizePool: PrizePool
  drawId: number
  className?: string
}

export const PrizesTable = (props: PrizesTableProps) => {
  const { prizePool, drawId, className } = props

  const { data: wins, isFetched: isFetchedWins } = usePrizeDrawWinners(prizePool)
  const drawWins = wins?.find((draw) => draw.id === drawId)?.prizeClaims

  const { status, closedAt, isFetched: isFetchedDrawStatus } = useDrawStatus(prizePool, drawId)

  const { data: prizes, isFetched: isFetchedPrizes } = useDrawResults(prizePool, drawId, {
    refetchInterval: status !== 'finalized' ? sToMs(300) : undefined
  })

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  // TODO: get number of tiers from draw object once available
  const numTiers = 8

  if (!isFetchedWins || !isFetchedDrawStatus || !isFetchedPrizes || !prizeToken) {
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
      {[...Array(numTiers).keys()].map((tier) => (
        <PrizesTableRow
          key={`prizesTier-${tier}`}
          prizePool={prizePool}
          drawId={drawId}
          wins={drawWins}
          tier={tier}
          closedAt={closedAt}
          prizes={prizes}
          prizeToken={prizeToken}
          className={gridClassName}
        />
      ))}
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

interface PrizesTableRowProps {
  prizePool: PrizePool
  drawId: number
  wins: SubgraphDraw['prizeClaims']
  tier: number
  closedAt: number
  prizes?: {
    vault: `0x${string}`
    winner: `0x${string}`
    tier: number
    prizeIndex: number
    amount: bigint
  }[]
  prizeToken: Token
  className?: string
}

const PrizesTableRow = (props: PrizesTableRowProps) => {
  const { prizePool, drawId, wins, tier, closedAt, prizes, prizeToken, className } = props

  return (
    <div className={classNames('py-3 text-sm bg-pt-purple-100/20 rounded-xl', className)}>
      <PrizeTier tier={tier} />
      <PrizeSize tier={tier} prizes={prizes} prizeToken={prizeToken} />
      <PrizesClaimed wins={wins} tier={tier} prizes={prizes} />
      <ClaimFees prizePool={prizePool} drawId={drawId} tier={tier} />
      <PrizeClaimTime tier={tier} />
    </div>
  )
}

interface PrizeTierProps {
  tier: number
}

const PrizeTier = (props: PrizeTierProps) => {
  const { tier } = props

  return (
    <span className='text-xl font-semibold text-pt-purple-400'>{tier === 0 ? 'GP' : tier}</span>
  )
}

interface PrizeSizeProps {
  tier: number
  prizes?: {
    vault: `0x${string}`
    winner: `0x${string}`
    tier: number
    prizeIndex: number
    amount: bigint
  }[]
  prizeToken: Token
}

const PrizeSize = (props: PrizeSizeProps) => {
  const { tier, prizes, prizeToken } = props

  const tierPrizes = prizes?.filter((prize) => prize.tier === tier)
  const prizeSize = tierPrizes?.[0]?.amount

  if (!prizeSize) {
    return <span>-</span>
  }

  return (
    <span>
      <span className='text-xl font-semibold'>
        {formatBigIntForDisplay(prizeSize, prizeToken.decimals, { maximumFractionDigits: 2 })}
      </span>{' '}
      {prizeToken.symbol}
    </span>
  )
}

interface PrizesClaimedProps {
  wins: SubgraphDraw['prizeClaims']
  tier: number
  prizes?: {
    vault: `0x${string}`
    winner: `0x${string}`
    tier: number
    prizeIndex: number
    amount: bigint
  }[]
}

const PrizesClaimed = (props: PrizesClaimedProps) => {
  const { wins, tier, prizes } = props

  const numTierWins = wins.filter((win) => win.tier === tier).length
  const numTierPrizes = prizes?.filter((prize) => prize.tier === tier).length ?? 0

  const highlightClassName = 'text-xl font-semibold'

  if (!numTierWins && !numTierPrizes) {
    return <span>-</span>
  }

  if (!numTierPrizes) {
    return <span className={highlightClassName}>{numTierWins}</span>
  }

  return (
    <span className={highlightClassName}>
      {numTierWins} / {numTierPrizes}
    </span>
  )
}

interface PrizeClaimTimeProps {
  tier: number
}

const PrizeClaimTime = (props: PrizeClaimTimeProps) => {
  const { tier } = props

  return <span className=''>-</span>
}
