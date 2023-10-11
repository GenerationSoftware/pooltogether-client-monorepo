import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useFirstDrawOpenedAt,
  usePrizeTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { getSimpleDate, MAX_UINT_256 } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { currentTimestampAtom } from 'src/atoms'
import { formatUnits, Log } from 'viem'
import { ReserveCard } from '@components/Reserve/ReserveCard'
import { useManualContributionEvents } from '@hooks/useManualContributionEvents'
import { usePrizeBackstopEvents } from '@hooks/usePrizeBackstopEvents'
import { useReserve } from '@hooks/useReserve'
import { RelayMsgTx, RelayTx, RngTx, useRngTxs } from '@hooks/useRngTxs'
import { LineChart } from './LineChart'

interface DataPoint {
  name: string
  reserve: number
  liquidations: number
  manual: number
  rngFees: number
  prizeBackstops: number
}

interface ReserveChartProps {
  prizePool: PrizePool
  className?: string
}

export const ReserveChart = (props: ReserveChartProps) => {
  const { prizePool, className } = props

  const { data: reserve } = useReserve(prizePool)

  const { data: rngTxs, isFetched: isFetchedRngTxs } = useRngTxs(prizePool)

  const { data: manualContributionEvents } = useManualContributionEvents(prizePool)

  const { data: prizeBackstopEvents } = usePrizeBackstopEvents(prizePool)

  const { data: firstDrawOpenedAt } = useFirstDrawOpenedAt(prizePool)

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  const currentTimestamp = useAtomValue(currentTimestampAtom)

  const chartData = useMemo(() => {
    if (
      !!reserve &&
      !!rngTxs &&
      isFetchedRngTxs &&
      !!firstDrawOpenedAt &&
      !!manualContributionEvents &&
      !!prizeBackstopEvents &&
      !!prizeToken
    ) {
      const data: DataPoint[] = []

      const formatPrizeNum = (val: bigint) => {
        return parseFloat(formatUnits(val, prizeToken.decimals))
      }

      const validRngTxs = rngTxs.filter((txs) => txs.rng.fee !== undefined && !!txs.relay.l2) as {
        rng: Required<RngTx>
        relay: { l1?: RelayMsgTx; l2: RelayTx }
      }[]

      let minBlock = 0n
      let maxBlock = validRngTxs[0]?.relay.l2.blockNumber
      let prevReserve = 0

      const isValidEvent = (event: Log<bigint, number, false>) => {
        return event.blockNumber >= minBlock && event.blockNumber < maxBlock
      }

      data.push({
        name: `Start-${firstDrawOpenedAt}`,
        reserve: 0,
        liquidations: 0,
        manual: 0,
        rngFees: 0,
        prizeBackstops: 0
      })

      validRngTxs.forEach((txs, i) => {
        const drawId = txs.rng.drawId
        const closedAt = txs.relay.l2.timestamp
        const name = `${drawId}-${closedAt}`
        const rngFees = formatPrizeNum(txs.rng.fee + txs.relay.l2.fee)
        const reserve = formatPrizeNum(txs.relay.l2.reserve)
        const reserveAfterFees = reserve - rngFees
        const manual = formatPrizeNum(
          manualContributionEvents.reduce((a, b) => a + (isValidEvent(b) ? b.args.amount : 0n), 0n)
        )
        const prizeBackstops = formatPrizeNum(
          prizeBackstopEvents.reduce((a, b) => a + (isValidEvent(b) ? b.args.amount : 0n), 0n)
        )
        const liquidations = reserveAfterFees - prevReserve - manual + rngFees + prizeBackstops

        data.push({
          name,
          reserve: reserveAfterFees,
          liquidations,
          manual,
          rngFees,
          prizeBackstops
        })

        minBlock = maxBlock
        maxBlock = validRngTxs[i + 1]?.relay.l2.blockNumber ?? MAX_UINT_256
        prevReserve = reserveAfterFees
      })

      const currentReserve = formatPrizeNum(reserve.current)
      const currentManual = formatPrizeNum(
        manualContributionEvents.reduce((a, b) => a + (isValidEvent(b) ? b.args.amount : 0n), 0n)
      )
      const currentPrizeBackstops = formatPrizeNum(
        prizeBackstopEvents.reduce((a, b) => a + (isValidEvent(b) ? b.args.amount : 0n), 0n)
      )
      const currentLiquidations =
        currentReserve - prevReserve - currentManual + currentPrizeBackstops

      data.push({
        name: `Now-${currentTimestamp}`,
        reserve: currentReserve,
        liquidations: currentLiquidations,
        manual: currentManual,
        rngFees: 0,
        prizeBackstops: currentPrizeBackstops
      })

      return data
    }
  }, [reserve, rngTxs, firstDrawOpenedAt, currentTimestamp])

  if (!!chartData?.length && !!prizeToken) {
    return (
      <div className={classNames('w-full flex flex-col gap-2', className)}>
        <LineChart
          data={chartData}
          lines={[{ id: 'reserve', strokeWidth: 3 }]}
          tooltip={{
            show: true,
            content: ({ active, payload, label }) => {
              if (active && !!payload?.length) {
                return (
                  <ReserveCard
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
