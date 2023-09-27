import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { SubgraphDraw, Token } from '@shared/types'
import { formatBigIntForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import { ClaimFees } from '@components/ClaimFees'

interface PrizesTableRowProps {
  prizePool: PrizePool
  drawId: number
  wins: SubgraphDraw['prizeClaims']
  tier: number
  numTiers: number
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

export const PrizesTableRow = (props: PrizesTableRowProps) => {
  const { prizePool, drawId, wins, tier, numTiers, closedAt, prizes, prizeToken, className } = props

  return (
    <div className={classNames('py-3 text-sm bg-pt-purple-100/50 rounded-xl', className)}>
      <PrizeTier tier={tier} numTiers={numTiers} />
      <PrizeSize tier={tier} prizes={prizes} prizeToken={prizeToken} />
      <PrizesClaimed wins={wins} tier={tier} prizes={prizes} />
      <ClaimFees prizePool={prizePool} drawId={drawId} tier={tier} />
      <PrizeClaimTime tier={tier} />
    </div>
  )
}

interface PrizeTierProps {
  tier: number
  numTiers: number
}

const PrizeTier = (props: PrizeTierProps) => {
  const { tier, numTiers } = props

  return (
    <span className='text-xl font-semibold text-pt-purple-400'>
      {tier === 0 ? 'GP' : tier === numTiers - 1 ? 'Canary' : tier}
    </span>
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
