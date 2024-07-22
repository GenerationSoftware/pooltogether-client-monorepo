import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useLastAwardedDrawId,
  usePrizeTokenData,
  useVaultContributionEvents
} from '@generationsoftware/hyperstructure-react-hooks'
import { useScreenSize } from '@shared/generic-react-hooks'
import { Token } from '@shared/types'
import { Intl } from '@shared/types'
import { Card, Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { formatUnits } from 'viem'
import { QUERY_START_BLOCK } from '@constants/config'
import { usePrizePoolPPCs } from '@hooks/usePrizePoolPPCs'
import { VaultPageCard } from './VaultPageCard'
import { VaultPrizeYield } from './VaultPrizeYield'

interface VaultPagePoolStakingContentProps {
  vault: Vault
  prizePool: PrizePool
  className?: string
}

export const VaultPagePoolStakingContent = (props: VaultPagePoolStakingContentProps) => {
  const { vault, prizePool, className } = props

  const numDraws = 7

  const t_vault = useTranslations('Vault')
  const t_common = useTranslations('Common')

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  const { data: lastAwardedDrawId } = useLastAwardedDrawId(prizePool)

  const drawIds = useMemo(() => {
    if (!!lastAwardedDrawId) {
      const current = {
        start: Math.max(lastAwardedDrawId - numDraws + 1, 1),
        end: Math.max(lastAwardedDrawId, 1)
      }
      const past = {
        start: Math.max(lastAwardedDrawId - numDraws * 2 + 1, 1),
        end: Math.max(lastAwardedDrawId - numDraws, 1)
      }

      return { current, past }
    }
  }, [lastAwardedDrawId])

  const { data: currentTotalPPCs } = usePrizePoolPPCs(prizePool, drawIds?.current!)

  const { data: pastTotalPPCs } = usePrizePoolPPCs(prizePool, drawIds?.past!)

  const { data: contributionEvents } = useVaultContributionEvents(prizePool, {
    vaultAddress: vault.address,
    fromBlock: QUERY_START_BLOCK[prizePool.chainId as keyof typeof QUERY_START_BLOCK]
  })

  const vaultContributions = useMemo(() => {
    if (
      !!prizeToken &&
      !!drawIds &&
      !!currentTotalPPCs &&
      !!pastTotalPPCs &&
      !!contributionEvents
    ) {
      const formatPrizeToken = (val: bigint) => parseFloat(formatUnits(val, prizeToken.decimals))

      const current = { amount: 0, totalAmount: formatPrizeToken(currentTotalPPCs), percentage: 0 }
      const past = { amount: 0, totalAmount: formatPrizeToken(pastTotalPPCs), percentage: 0 }

      contributionEvents.forEach(({ args: { drawId, amount } }) => {
        if (drawId > drawIds.current.start && drawId <= drawIds.current.end + 1) {
          current.amount += formatPrizeToken(amount)
        }

        if (drawId > drawIds.past.start && drawId <= drawIds.past.end + 1) {
          past.amount += formatPrizeToken(amount)
        }
      })

      current.percentage = (current.amount / current.totalAmount) * 100
      past.percentage = (past.amount / past.totalAmount) * 100

      return { current, past }
    }
  }, [prizeToken, drawIds, currentTotalPPCs, pastTotalPPCs, contributionEvents])

  return (
    <div className={classNames('w-full flex flex-col gap-8', className)}>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <ReserveRateCard
          numDraws={numDraws}
          currentReserveRate={vaultContributions?.current.percentage}
          pastReserveRate={vaultContributions?.past.percentage}
        />
        <VaultPageCard title={t_vault('headers.prizeYield')}>
          <VaultPrizeYield
            vault={vault}
            label={t_common('apr')}
            className='text-3xl font-semibold text-pt-purple-100'
          />
        </VaultPageCard>
      </div>
      <Card className='aspect-[2/3] md:aspect-[3/2] items-center'>
        <div className='flex flex-col gap-4 text-center text-pt-purple-100 font-semibold md:gap-1'>
          <span className='text-3xl'>
            {t_vault.rich('poolStaking.wherePrizesComeFrom', {
              highlight: (chunks) => <span className='text-pt-purple-300'>{chunks}</span>
            })}
          </span>
          <span>
            {t_vault.rich('poolStaking.reserveDescription', {
              highlight: (chunks) => <span className='text-pt-teal-light'>{chunks}</span>
            })}
          </span>
        </div>
        <div className='w-full flex grow items-center justify-center'>
          {!!prizeToken && !!vaultContributions ? (
            <VaultContributionsChart
              vaultContributions={vaultContributions}
              prizeToken={prizeToken}
              numDraws={numDraws}
            />
          ) : (
            <Spinner />
          )}
        </div>
      </Card>
    </div>
  )
}

interface ReserveRateCardProps {
  numDraws: number
  currentReserveRate?: number
  pastReserveRate?: number
  className?: string
}

const ReserveRateCard = (props: ReserveRateCardProps) => {
  const { numDraws, currentReserveRate, pastReserveRate } = props

  const t_vault = useTranslations('Vault')

  const formattedReserveRate =
    currentReserveRate !== undefined
      ? currentReserveRate.toLocaleString(undefined, { maximumFractionDigits: 2 })
      : undefined

  const change =
    currentReserveRate !== undefined && pastReserveRate !== undefined
      ? currentReserveRate - pastReserveRate
      : undefined
  const formattedChange = !!change
    ? Math.abs(change).toLocaleString(undefined, { maximumFractionDigits: 2 })
    : undefined

  return (
    <VaultPageCard title={t_vault('poolStaking.reserveRate')}>
      {currentReserveRate !== undefined ? (
        <>
          <span className='text-3xl font-semibold text-pt-purple-100'>
            {t_vault('poolStaking.percentageOfYield', { number: formattedReserveRate })}
          </span>
          {!!change && (
            <span
              className={classNames({
                'text-pt-teal-dark': change > 0,
                'text-pt-warning-light': change < 0
              })}
            >
              {change > 0 ? '↑' : '↓'}
              {formattedChange}%{' '}
              <span className='text-pt-purple-300'>
                {t_vault('poolStaking.lastNDraws', { number: numDraws })}
              </span>
            </span>
          )}
        </>
      ) : (
        <Spinner />
      )}
    </VaultPageCard>
  )
}

interface VaultContributionsChartProps {
  vaultContributions: {
    current: { amount: number; totalAmount: number; percentage: number }
    past: { amount: number; totalAmount: number; percentage: number }
  }
  prizeToken: Token
  numDraws: number
  className?: string
}

const VaultContributionsChart = (props: VaultContributionsChartProps) => {
  const { vaultContributions, prizeToken, numDraws, className } = props

  const t_poolStaking = useTranslations('Vault.poolStaking')

  const { isDesktop } = useScreenSize()

  const chartData = useMemo(() => {
    return [
      {
        name: 'totalContributions',
        amount: vaultContributions.current.totalAmount - vaultContributions.current.amount
      },
      { name: 'vaultContributions', amount: vaultContributions.current.amount }
    ]
  }, [vaultContributions])

  return (
    <div
      className={classNames('w-full h-full flex flex-col items-center justify-center', className)}
    >
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            data={chartData}
            dataKey='amount'
            innerRadius='60%'
            label={
              isDesktop
                ? (params) =>
                    getSvgLabel(params, vaultContributions, prizeToken, numDraws, t_poolStaking)
                : false
            }
            labelLine={false}
            cx={isDesktop ? '30%' : undefined}
          >
            <Cell
              key='totalContributionsCell'
              stroke='none'
              fill='#6538c1'
              style={{ outline: 'none' }}
            />
            <Cell
              key='vaultContributionsCell'
              stroke='none'
              fill='#35f0d0'
              style={{ outline: 'none' }}
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {!isDesktop && (
        <Keys vaultContributions={vaultContributions} prizeToken={prizeToken} numDraws={numDraws} />
      )}
    </div>
  )
}

interface KeysProps {
  vaultContributions: {
    current: { amount: number; totalAmount: number; percentage: number }
    past: { amount: number; totalAmount: number; percentage: number }
  }
  prizeToken: Token
  numDraws: number
  className?: string
}

const Keys = (props: KeysProps) => {
  const { vaultContributions, prizeToken, numDraws, className } = props

  const t_poolStaking = useTranslations('Vault.poolStaking')

  const { titles, formattedAmounts, changes, formattedChanges, fillColors, changeTimeText } =
    getKeysData(vaultContributions, numDraws, t_poolStaking)

  const Key = (props: { index: number }) => {
    const { index } = props

    return (
      <div className='flex items-start justify-between'>
        <div className='flex items-center gap-1'>
          <i className='w-4 h-4 rounded-full' style={{ backgroundColor: fillColors[index] }} />
          <span className='font-bold' style={{ color: fillColors[index] }}>
            {titles[index]}
          </span>
        </div>
        <div className='flex flex-col text-end'>
          <span className='text-xl leading-tight font-bold'>
            {formattedAmounts[index]} {prizeToken.symbol}
          </span>
          {!!changes[index] && (
            <span
              className={classNames({
                'text-pt-teal-dark': changes[index] > 0,
                'text-pt-warning-light': changes[index] < 0
              })}
            >
              {changes[index] > 0 ? '↑' : '↓'}
              {formattedChanges[index]}%{' '}
              <span className='text-pt-purple-300'>{changeTimeText}</span>
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={classNames('w-full flex flex-col gap-4', className)}>
      <Key index={0} />
      <Key index={1} />
    </div>
  )
}

const getKeysData = (
  vaultContributions: {
    current: { amount: number; totalAmount: number; percentage: number }
    past: { amount: number; totalAmount: number; percentage: number }
  },
  numDraws: number,
  intl: Intl<'nDayNetworkYield' | 'nDayPoolReserve' | 'lastNDays' | 'lastNDraws'>
) => {
  const titles = [
    intl('nDayNetworkYield', { number: numDraws }),
    intl('nDayPoolReserve', { number: numDraws })
  ]
  const formattedAmounts = [
    vaultContributions.current.totalAmount.toLocaleString(undefined, {
      maximumFractionDigits: 3
    }),
    vaultContributions.current.amount.toLocaleString(undefined, {
      maximumFractionDigits: 3
    })
  ]
  const changes = [
    (vaultContributions.current.totalAmount / vaultContributions.past.totalAmount - 1) * 100,
    (vaultContributions.current.amount / vaultContributions.past.amount - 1) * 100
  ]
  const formattedChanges = [
    Math.abs(changes[0]).toLocaleString(undefined, { maximumFractionDigits: 1 }),
    Math.abs(changes[1]).toLocaleString(undefined, { maximumFractionDigits: 1 })
  ]
  const fillColors = ['#6538c1', '#35f0d0']

  const changeTimeText = intl('lastNDraws', { number: numDraws })

  return { titles, formattedAmounts, changes, formattedChanges, fillColors, changeTimeText }
}

const getSvgLabel = (
  data: {
    cx: number
    cy: number
    midAngle: number
    innerRadius: number
    outerRadius: number
    maxRadius: number
    index: number
  },
  vaultContributions: {
    current: { amount: number; totalAmount: number; percentage: number }
    past: { amount: number; totalAmount: number; percentage: number }
  },
  prizeToken: Token,
  numDraws: number,
  intl: Intl<'nDayNetworkYield' | 'nDayPoolReserve' | 'lastNDays' | 'lastNDraws'>
) => {
  const { cx, cy, midAngle: _midAngle, innerRadius, outerRadius, maxRadius, index } = data

  const midAngle = index === 0 ? 35 : _midAngle
  const radius = innerRadius + (outerRadius - innerRadius)
  const x = maxRadius + (maxRadius - cx) / 3
  const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180)
  const lineLength = x - (cx + radius * Math.cos((-midAngle * Math.PI) / 180))

  const defaultProps = { x, y, dominantBaseline: 'middle' }

  const { titles, formattedAmounts, changes, formattedChanges, fillColors, changeTimeText } =
    getKeysData(vaultContributions, numDraws, intl)

  return (
    <>
      <LabelLine
        x={x - lineLength + 16}
        y={y}
        length={lineLength - 32}
        stroke={fillColors[index]}
      />
      <text {...defaultProps} fill={fillColors[index]} fontSize={20} fontWeight={700}>
        {titles[index]}
      </text>
      <text {...defaultProps} dy={36} fill='#deceff' fontSize={30} fontWeight={600}>
        {formattedAmounts[index]} {prizeToken.symbol}
      </text>
      {!!changes[index] && (
        <text
          {...defaultProps}
          dy={68}
          fill={changes[index] > 0 ? '#0dc5a5' : '#ffb6b6'}
          fontSize={16}
        >
          {changes[index] > 0 ? '↑' : '↓'}
          {formattedChanges[index]}% <tspan fill='#b18cff'>{changeTimeText}</tspan>
        </text>
      )}
    </>
  )
}

interface LabelLineProps {
  x: number
  y: number
  length: number
  stroke: string
}

const LabelLine = (props: LabelLineProps) => {
  const { x, y, length, stroke } = props

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      x={x}
      y={y - 3}
      width={length + 3}
      height={6}
      viewBox={`0 0 ${length + 3} 6`}
      fill='none'
    >
      <path d={`M${length} 3 L3 3`} stroke={stroke} strokeWidth={5} strokeLinecap='round' />
    </svg>
  )
}
