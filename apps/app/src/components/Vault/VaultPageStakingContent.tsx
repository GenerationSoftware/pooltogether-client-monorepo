import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useLastAwardedDrawId,
  usePrizeTokenData,
  useVaultContributionEvents
} from '@generationsoftware/hyperstructure-react-hooks'
import { useScreenSize } from '@shared/generic-react-hooks'
import { Token } from '@shared/types'
import { Intl } from '@shared/types'
import { Card, Spinner } from '@shared/ui'
import { getNiceNetworkNameByChainId } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { formatUnits } from 'viem'
import { POOL_STAKING_VAULTS, QUERY_START_BLOCK } from '@constants/config'
import { usePrizePoolPPCs } from '@hooks/usePrizePoolPPCs'
import { VaultPageCard } from './VaultPageCard'

interface VaultPagePoolStakingContentProps {
  prizePool: PrizePool
  className?: string
}

export const VaultPagePoolStakingContent = (props: VaultPagePoolStakingContentProps) => {
  const { prizePool, className } = props

  const numDraws = 7

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
    vaultAddress: POOL_STAKING_VAULTS[prizePool.chainId],
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
      const vaultPPCs = contributionEvents.map((event) => ({
        drawId: event.args.drawId,
        amount: event.args.amount
      }))

      const formatPrizeToken = (val: bigint) => parseFloat(formatUnits(val, prizeToken.decimals))

      const current = { amount: 0, totalAmount: formatPrizeToken(currentTotalPPCs), percentage: 0 }
      const past = { amount: 0, totalAmount: formatPrizeToken(pastTotalPPCs), percentage: 0 }

      vaultPPCs.forEach((vaultPPC) => {
        if (vaultPPC.drawId >= drawIds.current.start && vaultPPC.drawId <= drawIds.current.end) {
          current.amount += formatPrizeToken(vaultPPC.amount)
        }

        if (vaultPPC.drawId >= drawIds.past.start && vaultPPC.drawId <= drawIds.past.end) {
          past.amount += formatPrizeToken(vaultPPC.amount)
        }
      })

      current.percentage = (current.amount / current.totalAmount) * 100
      past.percentage = (past.amount / past.totalAmount) * 100

      return { current, past }
    }
  }, [prizeToken, drawIds, currentTotalPPCs, pastTotalPPCs, contributionEvents])

  return (
    <div className={classNames('w-full flex flex-col gap-8', className)}>
      <ReserveRateCard
        chainId={prizePool.chainId}
        numDraws={numDraws}
        currentReserveRate={vaultContributions?.current.percentage}
        pastReserveRate={vaultContributions?.past.percentage}
      />
      <Card className='aspect-[7/8] md:aspect-[3/2] items-center'>
        {!!prizeToken && !!vaultContributions ? (
          <VaultContributionsChart
            vaultContributions={vaultContributions}
            prizeToken={prizeToken}
            numDraws={numDraws}
          />
        ) : (
          <Spinner />
        )}
      </Card>
    </div>
  )
}

interface ReserveRateCardProps {
  chainId: number
  numDraws: number
  currentReserveRate?: number
  pastReserveRate?: number
  className?: string
}

const ReserveRateCard = (props: ReserveRateCardProps) => {
  const { chainId, numDraws, currentReserveRate, pastReserveRate } = props

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
    <VaultPageCard title={t_vault('poolReserveRateTitle')}>
      {currentReserveRate !== undefined ? (
        <>
          <span className='text-3xl font-semibold text-pt-purple-100'>
            {t_vault('percentageOfYield', { number: formattedReserveRate })}
          </span>
          {!!change && (
            <span
              className={classNames({
                'text-pt-teal-dark': change > 0,
                'text-pt-warning-dark': change < 0
              })}
            >
              {change > 0 ? '↑' : '↓'}
              {formattedChange}%{' '}
              <span className='text-pt-purple-300'>
                {t_vault('lastNDraws', { number: numDraws })}
              </span>
            </span>
          )}
        </>
      ) : (
        <Spinner />
      )}
      <span className='text-lg text-pt-purple-300'>
        {t_vault('poolReserveRateDescription', { network: getNiceNetworkNameByChainId(chainId) })}
      </span>
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

  const t_vault = useTranslations('Vault')

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

  // TODO: improve vertical padding of chart container on desktop and mobile
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
                ? (params) => getSvgLabel(params, vaultContributions, prizeToken, numDraws, t_vault)
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

  const t_vault = useTranslations('Vault')

  const { titles, formattedAmounts, changes, formattedChanges, fillColors, changeTimeText } =
    getKeysData(vaultContributions, numDraws, t_vault)

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
                'text-pt-warning-dark': changes[index] < 0
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
          fill={changes[index] > 0 ? '#0dc5a5' : '#8b0000'}
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
