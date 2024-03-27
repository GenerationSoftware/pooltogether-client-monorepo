import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { Prize, SubgraphDraw, Token } from '@shared/types'
import { formatBigIntForDisplay, getTimeBreakdown } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'
import { isCanaryTier } from 'src/utils'
import { ClaimFees } from '@components/ClaimFees'
import { prizesHeaders } from './PrizesTable'

interface PrizesTableRowProps {
  prizePool: PrizePool
  drawId: number
  wins: SubgraphDraw['prizeClaims']
  tier: number
  numTiers: number
  awardedAt: number
  prizes?: Prize[]
  prizeToken: Token
  className?: string
}

export const PrizesTableRow = (props: PrizesTableRowProps) => {
  const { prizePool, drawId, wins, tier, numTiers, awardedAt, prizes, prizeToken, className } =
    props

  return (
    <div
      className={classNames(
        'text-center py-6 text-sm bg-pt-transparent rounded-xl md:text-start md:py-3',
        className
      )}
    >
      <PrizeTier tier={tier} numTiers={numTiers} className='w-full md:w-auto' />
      <PrizeSize
        tier={tier}
        wins={wins}
        prizes={prizes}
        prizeToken={prizeToken}
        className='w-1/2 md:w-auto'
      />
      <PrizesClaimed wins={wins} tier={tier} prizes={prizes} className='w-1/2 md:w-auto' />
      <PrizeFees
        prizePool={prizePool}
        drawId={drawId}
        tier={tier}
        numTiers={numTiers}
        className='w-full md:w-auto'
      />
      <PrizeClaimTime wins={wins} tier={tier} awardedAt={awardedAt} className='w-full md:w-auto' />
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
    <span className={classNames('text-xl font-semibold text-pt-purple-200', className)}>
      {tier === 0 ? (
        'GP'
      ) : tier >= numTiers - 2 ? (
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
  wins: SubgraphDraw['prizeClaims']
  prizes?: Prize[]
  prizeToken: Token
  className?: string
}

const PrizeSize = (props: PrizeSizeProps) => {
  const { tier, wins, prizes, prizeToken, className } = props

  const tierPrizes = prizes?.filter((prize) => prize.tier === tier)
  const tierWins = wins.filter((win) => win.tier === tier)

  const prizeSize =
    tierPrizes?.[0]?.amount ?? !!tierWins[0]
      ? tierWins[0].payout + tierWins[0].claimReward
      : undefined

  return (
    <div className={classNames('flex flex-col gap-2', className)}>
      <span className='text-pt-purple-300 md:hidden'>{prizesHeaders.size}</span>
      <span className='text-pt-purple-200'>
        {!!prizeSize ? (
          <>
            <span className='text-xl font-semibold'>
              {formatBigIntForDisplay(prizeSize, prizeToken.decimals, { maximumFractionDigits: 2 })}
            </span>{' '}
            {prizeToken.symbol}
          </>
        ) : !!tierPrizes?.length ? (
          '?' // TODO: there should be enough data onchain to calculate this retroactively
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
  prizes?: Prize[]
  className?: string
}

const PrizesClaimed = (props: PrizesClaimedProps) => {
  const { wins, tier, prizes, className } = props

  const numTierWins = wins.filter((win) => win.tier === tier).length
  const numTierPrizes = prizes?.filter((prize) => prize.tier === tier).length ?? 0

  const highlightClassName = 'text-xl font-semibold text-pt-purple-200'

  return (
    <div className={classNames('flex flex-col gap-2', className)}>
      <span className='text-pt-purple-300 md:hidden'>{prizesHeaders.claimed}</span>
      {!!numTierPrizes ? (
        <span className={highlightClassName}>
          {numTierWins.toLocaleString()} / {numTierPrizes.toLocaleString()}
        </span>
      ) : !prizes ? (
        <span className={highlightClassName}>{numTierWins.toLocaleString()}</span>
      ) : (
        <span>-</span>
      )}
    </div>
  )
}

interface PrizeFeesProps {
  prizePool: PrizePool
  drawId: number
  tier: number
  numTiers: number
  className?: string
}

const PrizeFees = (props: PrizeFeesProps) => {
  const { prizePool, drawId, tier, numTiers, className } = props

  return (
    <div className={classNames('flex flex-col gap-2', className)}>
      <span className='text-pt-purple-300 md:hidden'>{prizesHeaders.fees}</span>
      {isCanaryTier(tier, numTiers) ? (
        <span>-</span>
      ) : (
        <ClaimFees
          prizePool={prizePool}
          drawId={drawId}
          tier={tier}
          className='items-center text-start md:items-start'
        />
      )}
    </div>
  )
}

interface PrizeClaimTimeProps {
  wins: SubgraphDraw['prizeClaims']
  tier: number
  awardedAt: number
  className?: string
}

const PrizeClaimTime = (props: PrizeClaimTimeProps) => {
  const { wins, tier, awardedAt, className } = props

  const claimTimeStats = useMemo(() => {
    const tierWins = wins.filter((win) => win.tier === tier)

    if (!!tierWins.length) {
      let sumSeconds = 0
      let high = 0
      let low = Number.MAX_SAFE_INTEGER

      tierWins.forEach((win) => {
        const seconds = win.timestamp - awardedAt

        if (seconds > high) high = seconds
        if (seconds < low) low = seconds

        sumSeconds += seconds
      })

      const avg = sumSeconds / tierWins.length

      return { avg, high, low }
    }
  }, [wins, tier, awardedAt])

  return (
    <div className={classNames('flex flex-col gap-2 items-center md:items-start', className)}>
      <span className='text-pt-purple-300 md:hidden'>{prizesHeaders.time}</span>
      {!!claimTimeStats ? (
        <div className='flex flex-col gap-1'>
          <ClaimTimeStat type='avg' seconds={claimTimeStats.avg} />
          <ClaimTimeStat type='high' seconds={claimTimeStats.high} />
          <ClaimTimeStat type='low' seconds={claimTimeStats.low} />
        </div>
      ) : (
        <span>-</span>
      )}
    </div>
  )
}

interface ClaimTimeStatProps {
  type: 'avg' | 'high' | 'low'
  seconds: number
  className?: string
}

const ClaimTimeStat = (props: ClaimTimeStatProps) => {
  const { type, seconds, className } = props

  const { hours, minutes } = getTimeBreakdown(seconds)

  return (
    <div
      className={classNames(
        'flex items-center text-sm',
        {
          'text-pt-purple-200': type === 'avg',
          'text-green-200': type === 'high',
          'text-red-400': type === 'low'
        },
        className
      )}
    >
      <span className='w-10 border-r border-r-pt-purple-600'>{type.toUpperCase()}</span>
      <div className='flex gap-1 items-center pl-2'>
        {!!hours && (
          <span className='flex items-center'>
            <span className='text-xl'>{hours}</span>Hr{hours > 1 ? 's' : ''}
          </span>
        )}
        {!!minutes && (
          <span className='flex items-center'>
            <span className='text-xl'>{minutes}</span>Min{minutes > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  )
}
