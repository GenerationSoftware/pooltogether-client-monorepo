import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useFirstDrawOpenedAt,
  useTransferEvents
} from '@generationsoftware/hyperstructure-react-hooks'
import { Token } from '@shared/types'
import { DEAD_ADDRESS, getSimpleDate, MAX_UINT_256 } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { currentTimestampAtom } from 'src/atoms'
import { Address, formatUnits, Log } from 'viem'
import { BurnCard } from '@components/Burn/BurnCard'
import { BURN_ADDRESSES, QUERY_START_BLOCK, VAULT_LPS } from '@constants/config'
import { RelayMsgTx, RelayTx, RngTx, useRngTxs } from '@hooks/useRngTxs'
import { AreaChart } from './AreaChart'

interface DataPoint {
  name: string
  lp: { total: number; change: number }
  manual: { total: number; change: number }
  other: { total: number; change: number }
}

interface BurnChartProps {
  prizePool: PrizePool
  prizeToken: Token
  className?: string
}

export const BurnChart = (props: BurnChartProps) => {
  const { prizePool, prizeToken, className } = props

  const lpAddresses = VAULT_LPS[prizeToken.chainId] ?? []
  const miscBurnAddresses = BURN_ADDRESSES[prizeToken.chainId] ?? []

  const { data: burnEvents } = useTransferEvents(prizeToken.chainId, prizeToken.address, {
    to: [...lpAddresses, ...miscBurnAddresses, DEAD_ADDRESS],
    fromBlock: QUERY_START_BLOCK[prizeToken.chainId]
  })

  const { data: rngTxs, isFetched: isFetchedRngTxs } = useRngTxs(prizePool)

  const { data: firstDrawOpenedAt } = useFirstDrawOpenedAt(prizePool)

  const currentTimestamp = useAtomValue(currentTimestampAtom)

  const chartData = useMemo(() => {
    if (!!burnEvents?.length && !!rngTxs && isFetchedRngTxs && !!firstDrawOpenedAt) {
      const data: DataPoint[] = []

      const formatBurnNum = (val: bigint) => {
        return parseFloat(formatUnits(val, prizeToken.decimals))
      }

      const validRngTxs = rngTxs.filter((txs) => !!txs.relay.l2) as {
        rng: RngTx
        relay: { l1?: RelayMsgTx; l2: RelayTx }
      }[]

      let minBlock = 0n
      let maxBlock = burnEvents[0].blockNumber

      let lp = { total: 0, change: 0 }
      let manual = { total: 0, change: 0 }
      let other = { total: 0, change: 0 }

      const isValidEvent = (event: Log<bigint, number, false>) => {
        return event.blockNumber >= minBlock && event.blockNumber < maxBlock
      }

      data.push({
        name: `Start-${firstDrawOpenedAt}`,
        lp: { total: lp.total, change: lp.change },
        manual: { total: manual.total, change: manual.change },
        other: { total: other.total, change: other.change }
      })

      validRngTxs.forEach((txs, i) => {
        const drawId = txs.rng.drawId
        const closedAt = txs.relay.l2.timestamp

        // TODO: avoid an O^2 time complexity
        burnEvents.forEach((burnEvent) => {
          if (isValidEvent(burnEvent)) {
            const toAddress = burnEvent.args.to.toLowerCase() as Lowercase<Address>
            const burnAmount = formatBurnNum(burnEvent.args.value)

            if (lpAddresses.includes(toAddress)) {
              lp.change += burnAmount
            } else if (toAddress === DEAD_ADDRESS) {
              manual.change += burnAmount
            } else {
              other.change += burnAmount
            }
          }
        })

        lp.total += lp.change
        manual.total += manual.change
        other.total += other.change

        data.push({
          name: `${drawId}-${closedAt}`,
          lp: { total: lp.total, change: lp.change },
          manual: { total: manual.total, change: manual.change },
          other: { total: other.total, change: other.change }
        })

        minBlock = maxBlock
        maxBlock = validRngTxs[i + 1]?.relay.l2.blockNumber ?? MAX_UINT_256

        lp.change = 0
        manual.change = 0
        other.change = 0
      })

      burnEvents.forEach((burnEvent) => {
        if (isValidEvent(burnEvent)) {
          const toAddress = burnEvent.args.to.toLowerCase() as Lowercase<Address>
          const burnAmount = formatBurnNum(burnEvent.args.value)

          if (lpAddresses.includes(toAddress)) {
            lp.change += burnAmount
          } else if (toAddress === DEAD_ADDRESS) {
            manual.change += burnAmount
          } else {
            other.change += burnAmount
          }
        }
      })

      lp.total += lp.change
      manual.total += manual.change
      other.total += other.change

      data.push({
        name: `Now-${currentTimestamp}`,
        lp: { total: lp.total, change: lp.change },
        manual: { total: manual.total, change: manual.change },
        other: { total: other.total, change: other.change }
      })

      return data
    }
  }, [burnEvents, rngTxs, firstDrawOpenedAt, currentTimestamp])

  if (!!chartData?.length) {
    return (
      <div className={classNames('w-full flex flex-col gap-2', className)}>
        <AreaChart
          data={chartData}
          areas={[
            { id: 'lp.total', stackId: 1 },
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
                    prizeToken={prizeToken}
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
              if (id === 'lp.total') {
                return 'Prizes to LPs'
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
            interval: 5,
            tickFormatter: (tick) => formatXAxisDateTick(tick)
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
