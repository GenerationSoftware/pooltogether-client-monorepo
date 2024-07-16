import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useLastAwardedDrawId,
  usePrizeTokenData,
  useVaultContributionEvents
} from '@generationsoftware/hyperstructure-react-hooks'
import { Token } from '@shared/types'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useMemo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { formatUnits } from 'viem'
import { POOL_STAKING_VAULTS, QUERY_START_BLOCK } from '@constants/config'
import { usePrizePoolPPCs } from '@hooks/usePrizePoolPPCs'

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
    <div className={classNames('w-full flex flex-col', className)}>
      {/* TODO: show explainer sentence */}
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

  const fillColors = ['#6538c1', '#35f0d0']

  // TODO: show label under chart for mobile
  return (
    <div className={classNames('w-full aspect-[3/2] flex items-center justify-center', className)}>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            data={[
              {
                name: 'totalContributions',
                amount: vaultContributions.current.totalAmount - vaultContributions.current.amount
              },
              { name: 'vaultContributions', amount: vaultContributions.current.amount }
            ]}
            dataKey='amount'
            innerRadius='60%'
            label={({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
              // TODO: display both on the right with straight lines
              const radius = 25 + innerRadius + (outerRadius - innerRadius)
              const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180)
              const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180)

              // TODO: localization
              const titles = [`${numDraws}D Network Yield`, `${numDraws}D POOL Reserve`]
              const amounts = [
                vaultContributions.current.totalAmount.toLocaleString(undefined, {
                  maximumFractionDigits: 3
                }),
                vaultContributions.current.amount.toLocaleString(undefined, {
                  maximumFractionDigits: 3
                })
              ]
              const changes = [
                (vaultContributions.current.totalAmount / vaultContributions.past.totalAmount - 1) *
                  100,
                (vaultContributions.current.amount / vaultContributions.past.amount - 1) * 100
              ]

              const defaultProps = { x, y, dominantBaseline: 'middle' }

              return (
                <g textAnchor={midAngle >= 90 && midAngle <= 270 ? 'end' : 'start'}>
                  <text {...defaultProps} fill={fillColors[index]} fontSize={20} fontWeight={700}>
                    {titles[index]}
                  </text>
                  <text {...defaultProps} dy={36} fill='#deceff' fontSize={30} fontWeight={600}>
                    {amounts[index]} {prizeToken.symbol}
                  </text>
                  {!!changes[index] && (
                    <text
                      {...defaultProps}
                      dy={68}
                      fill={changes[index] > 0 ? '#0dc5a5' : '#8b0000'}
                      fontSize={16}
                    >
                      {changes[index] > 0 ? '↑' : '↓'}{' '}
                      {Math.abs(changes[index]).toLocaleString(undefined, {
                        maximumFractionDigits: 1
                      })}
                      %{' '}
                      <tspan fill='#b18cff'>
                        {/* TODO: localization */}
                        last {numDraws} draws
                      </tspan>
                    </text>
                  )}
                </g>
              )
            }}
          >
            <Cell
              key='totalContributionsCell'
              stroke='none'
              fill={fillColors[0]}
              style={{ outline: 'none' }}
            />
            <Cell
              key='vaultContributionsCell'
              stroke='none'
              fill={fillColors[1]}
              style={{ outline: 'none' }}
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
