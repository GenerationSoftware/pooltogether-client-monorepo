import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { SubgraphDraw, Token } from '@shared/types'
import { formatBigIntForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import { ClaimFees } from '@components/ClaimFees'
import { prizesHeaders } from './PrizesTable'

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
    <div
      className={classNames(
        'text-center py-6 text-sm bg-pt-purple-100/50 rounded-xl md:text-start md:py-3',
        className
      )}
    >
      <PrizeTier tier={tier} numTiers={numTiers} className='w-full md:w-auto' />
      <PrizeSize tier={tier} prizes={prizes} prizeToken={prizeToken} className='w-1/2 md:w-auto' />
      <PrizesClaimed wins={wins} tier={tier} prizes={prizes} className='w-1/2 md:w-auto' />
      <PrizeFees prizePool={prizePool} drawId={drawId} tier={tier} className='w-full md:w-auto' />
      <PrizeClaimTime tier={tier} className='w-full md:w-auto' />
    </div>
  )
}

interface PrizeTierProps {
  tier: number
  numTiers: number
  className?: string
}

const PrizeTier = (props: PrizeTierProps) => {
  const { tier, numTiers, className } = props

  return (
    <span className={classNames('text-xl font-semibold text-pt-purple-400', className)}>
      {tier === 0 ? (
        'GP'
      ) : tier === numTiers - 1 ? (
        'Canary'
      ) : (
        <>
          <span className='md:hidden'>Tier </span>
          {tier}
        </>
      )}
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
  className?: string
}

const PrizeSize = (props: PrizeSizeProps) => {
  const { tier, prizes, prizeToken, className } = props

  const tierPrizes = prizes?.filter((prize) => prize.tier === tier)
  const prizeSize = tierPrizes?.[0]?.amount

  return (
    <div className={classNames('flex flex-col gap-2', className)}>
      <span className='text-pt-purple-500 md:hidden'>{prizesHeaders.size}</span>
      <span>
        {!!prizeSize ? (
          <>
            <span className='text-xl font-semibold'>
              {formatBigIntForDisplay(prizeSize, prizeToken.decimals, { maximumFractionDigits: 2 })}
            </span>{' '}
            {prizeToken.symbol}
          </>
        ) : (
          '-'
        )}
      </span>
    </div>
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
  className?: string
}

const PrizesClaimed = (props: PrizesClaimedProps) => {
  const { wins, tier, prizes, className } = props

  const numTierWins = wins.filter((win) => win.tier === tier).length
  const numTierPrizes = prizes?.filter((prize) => prize.tier === tier).length ?? 0

  const highlightClassName = 'text-xl font-semibold'

  return (
    <div className={classNames('flex flex-col gap-2', className)}>
      <span className='text-pt-purple-500 md:hidden'>{prizesHeaders.claimed}</span>
      <span>
        {!!numTierWins && !!numTierPrizes ? (
          <span className={highlightClassName}>
            {numTierWins} / {numTierPrizes}
          </span>
        ) : !!numTierPrizes ? (
          <span className={highlightClassName}>{numTierWins}</span>
        ) : (
          <span>-</span>
        )}
      </span>
    </div>
  )
}

interface PrizeFeesProps {
  prizePool: PrizePool
  drawId: number
  tier: number
  className?: string
}

const PrizeFees = (props: PrizeFeesProps) => {
  const { prizePool, drawId, tier, className } = props

  return (
    <div className={classNames('flex flex-col gap-2', className)}>
      <span className='text-pt-purple-500 md:hidden'>{prizesHeaders.fees}</span>
      <ClaimFees
        prizePool={prizePool}
        drawId={drawId}
        tier={tier}
        className='items-center text-start'
      />
    </div>
  )
}

interface PrizeClaimTimeProps {
  tier: number
  className?: string
}

const PrizeClaimTime = (props: PrizeClaimTimeProps) => {
  const { tier, className } = props

  return (
    <div className={classNames('flex flex-col gap-2', className)}>
      <span className='text-pt-purple-500 md:hidden'>{prizesHeaders.time}</span>
      <span>-</span>
    </div>
  )
}
