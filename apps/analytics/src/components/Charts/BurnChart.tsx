import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useFirstDrawOpenedAt,
  useLiquidationEvents,
  useTransferEvents
} from '@generationsoftware/hyperstructure-react-hooks'
import { Token } from '@shared/types'
import {
  DEAD_ADDRESS,
  formatNumberForDisplay,
  getSimpleDate,
  MAX_UINT_256
} from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { currentTimestampAtom } from 'src/atoms'
import { Address, formatUnits } from 'viem'
import { BurnCard } from '@components/Burn/BurnCard'
import { BURN_SETTINGS, QUERY_START_BLOCK } from '@constants/config'
import { DrawFinishTx, DrawStartTx, useRngTxs } from '@hooks/useRngTxs'
import { AreaChart } from './AreaChart'

interface DataPoint {
  name: string
  buyback: { total: number; change: number }
  manual: { total: number; change: number }
  other: { total: number; change: number }
}

interface BurnChartProps {
  prizePool: PrizePool
  burnToken: Token
  className?: string
}

export const BurnChart = (props: BurnChartProps) => {
  const { prizePool, burnToken, className } = props

  const { data: burnEvents } = useTransferEvents(burnToken.chainId, burnToken.address, {
    to: BURN_SETTINGS[burnToken.chainId].burnAddresses,
    fromBlock: QUERY_START_BLOCK[burnToken.chainId]
  })

  const { data: liquidationEvents } = useLiquidationEvents(prizePool.chainId, {
    fromBlock: QUERY_START_BLOCK[prizePool.chainId]
  })

  const { data: rngTxs, isFetched: isFetchedRngTxs } = useRngTxs(prizePool)

  const { data: firstDrawOpenedAt } = useFirstDrawOpenedAt(prizePool)

  const currentTimestamp = useAtomValue(currentTimestampAtom)

  const chartData = useMemo(() => {
    if (
      !!burnEvents?.length &&
      !!liquidationEvents &&
      !!rngTxs &&
      isFetchedRngTxs &&
      !!firstDrawOpenedAt
    ) {
      const data: DataPoint[] = []

      const formatBurnNum = (val: bigint) => {
        return parseFloat(formatUnits(val, burnToken.decimals))
      }

      const validRngTxs = rngTxs.filter((txs) => !!txs.drawFinish) as {
        drawStart: DrawStartTx
        drawFinish: DrawFinishTx
      }[]

      const firstRngBlockNumber = validRngTxs[0]?.drawFinish.blockNumber ?? MAX_UINT_256
      const lastRngBlockNumber =
        validRngTxs[validRngTxs.length - 1]?.drawFinish.blockNumber ?? MAX_UINT_256

      const buybackLpAddress = BURN_SETTINGS[burnToken.chainId].liquidationPairAddress
      const buybackTxHashes = !!buybackLpAddress
        ? liquidationEvents
            .filter((event) => event.args.liquidationPair.toLowerCase() === buybackLpAddress)
            .map((e) => e.transactionHash)
        : []

      let buyback = { total: 0, change: 0 }
      let manual = { total: 0, change: 0 }
      let other = { total: 0, change: 0 }

      const updateBurnAmounts = (entryName: string, minBlock: bigint, maxBlock: bigint) => {
        burnEvents.forEach((burnEvent) => {
          if (burnEvent.blockNumber >= minBlock && burnEvent.blockNumber < maxBlock) {
            const toAddress = burnEvent.args.to.toLowerCase() as Lowercase<Address>
            const burnAmount = formatBurnNum(burnEvent.args.value)

            if (toAddress === DEAD_ADDRESS) {
              // TODO: it is possible to have multiple events in one tx - this could cause issues (use amount to match?)
              if (buybackTxHashes.includes(burnEvent.transactionHash)) {
                buyback.change += burnAmount
              } else {
                manual.change += burnAmount
              }
            } else {
              other.change += burnAmount
            }
          }
        })

        buyback.total += buyback.change
        manual.total += manual.change
        other.total += other.change

        data.push({
          name: entryName,
          buyback: { total: buyback.total, change: buyback.change },
          manual: { total: manual.total, change: manual.change },
          other: { total: other.total, change: other.change }
        })

        buyback.change = 0
        manual.change = 0
        other.change = 0
      }

      updateBurnAmounts(`Start-${firstDrawOpenedAt}`, 0n, firstRngBlockNumber)

      validRngTxs.forEach((txs, i) => {
        const drawId = txs.drawFinish.drawId
        const awardedAt = txs.drawFinish.timestamp
        const minBlock = validRngTxs[i].drawFinish.blockNumber
        const maxBlock = validRngTxs[i + 1]?.drawFinish.blockNumber ?? 0n

        updateBurnAmounts(`${drawId}-${awardedAt}`, minBlock, maxBlock)
      })

      updateBurnAmounts(`Now-${currentTimestamp}`, lastRngBlockNumber, MAX_UINT_256)

      return data
    }
  }, [burnEvents, liquidationEvents, rngTxs, firstDrawOpenedAt, currentTimestamp])

  if (!!chartData?.length) {
    return (
      <div className={classNames('w-full flex flex-col gap-2 text-pt-purple-800', className)}>
        <AreaChart
          data={chartData}
          areas={[
            { id: 'buyback.total', stackId: 1 },
            { id: 'manual.total', stackId: 1 },
            { id: 'other.total', stackId: 1 }
          ]}
          tooltip={{
            show: true,
            content: ({ active, payload, label }) => {
              if (active && !!payload?.length) {
                return (
                  <BurnCard
                    {...(payload[0].payload as DataPoint)}
                    name={formatTooltipLabel(label)}
                    burnToken={burnToken}
                  />
                )
              } else {
                return <></>
              }
            }
          }}
          legend={{
            show: true,
            formatter: (id) => {
              if (id === 'buyback.total') {
                return 'Buyback Burns'
              } else if (id === 'manual.total') {
                return 'Manual Burns'
              } else if (id === 'other.total') {
                return 'Other'
              } else {
                return '?'
              }
            }
          }}
          xAxis={{
            interval: 'preserveStart',
            minTickGap: 50,
            tickFormatter: (tick) => formatXAxisDateTick(tick)
          }}
          yAxis={{
            tickFormatter: (tick) => formatNumberForDisplay(tick, { maximumFractionDigits: 0 })
          }}
        />
      </div>
    )
  }

  return <></>
}

const formatTooltipLabel = (label: string) => {
  const [drawId, timestamp] = label.split('-')
  return !isNaN(+drawId) ? `${getSimpleDate(Number(timestamp))} (Draw #${drawId})` : drawId
}

const formatXAxisDateTick = (tick: string | number) => {
  return new Date(Number(String(tick).split('-')[1]) * 1e3).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  })
}
