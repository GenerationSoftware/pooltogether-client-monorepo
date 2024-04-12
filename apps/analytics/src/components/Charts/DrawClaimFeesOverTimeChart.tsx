import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useBlocksAtTimestamps,
  usePrizeDrawWinners,
  usePrizeTokenPrice,
  useTokenPrices
} from '@generationsoftware/hyperstructure-react-hooks'
import {
  formatNumberForDisplay,
  getSimpleTime,
  NETWORK,
  SECONDS_PER_MINUTE,
  USDC_TOKEN_ADDRESSES
} from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { currentTimestampAtom } from 'src/atoms'
import { formatUnits } from 'viem'
import { useClaimFeesOverTime } from '@hooks/useClaimFeesOverTime'
import { useDrawStatus } from '@hooks/useDrawStatus'
import { LineChart } from './LineChart'

interface DrawClaimFeesOverTimeChartProps {
  prizePool: PrizePool
  drawId: number
  className?: string
}

export const DrawClaimFeesOverTimeChart = (props: DrawClaimFeesOverTimeChartProps) => {
  const { prizePool, drawId, className } = props

  const { data: prizeToken, isFetched: isFetchedPrizeToken } = usePrizeTokenPrice(prizePool)

  const { data: tokenPrices, isFetched: isFetchedTokenPrices } = useTokenPrices(NETWORK.mainnet, [
    USDC_TOKEN_ADDRESSES[NETWORK.mainnet]
  ])
  const usdPrice = tokenPrices?.[USDC_TOKEN_ADDRESSES[NETWORK.mainnet]]

  const { data: wins, isFetched: isFetchedWins } = usePrizeDrawWinners(prizePool)
  const drawWins = wins?.find((draw) => draw.id === drawId)?.prizeClaims
  const winTimestamps = [...new Set(drawWins?.map((w) => w.timestamp) ?? [])]

  // TODO: once subgraph returns block numbers, this is no longer necessary
  const { data: winBlocks, isFetched: isFetchedWinBlocks } = useBlocksAtTimestamps(
    prizePool.chainId,
    winTimestamps
  )

  const {
    closedAt,
    awardedAt,
    finalizedAt,
    isFetched: isFetchedDrawStatus
  } = useDrawStatus(prizePool, drawId)

  const currentTimestamp = useAtomValue(currentTimestampAtom)

  const periodicTimestamps = useMemo(() => {
    const timestamps: number[] = []

    if (!!closedAt && !!finalizedAt) {
      const startTimestamp = closedAt
      const endTimestamp = Math.min(finalizedAt, currentTimestamp)

      for (let i = startTimestamp; i < endTimestamp; i += SECONDS_PER_MINUTE * 5) {
        timestamps.push(i)
      }
      timestamps.push(endTimestamp)
    }

    return timestamps
  }, [closedAt, finalizedAt, currentTimestamp])

  const { data: periodicBlocks, isFetched: isFetchedPeriodicBlocks } = useBlocksAtTimestamps(
    prizePool.chainId,
    periodicTimestamps
  )

  const blockNumbers = useMemo(() => {
    const values: { [timestamp: number]: bigint } = {}

    Object.entries(periodicBlocks).forEach(([timestamp, block]) => {
      values[parseInt(timestamp)] = block.number
    })

    Object.entries(winBlocks).forEach(([timestamp, block]) => {
      values[parseInt(timestamp)] = block.number
    })

    return values
  }, [periodicBlocks, winBlocks])

  const uniqueBlockNumbers = [...new Set(Object.values(blockNumbers))]
  const { data: claimFeesOverTime, isFetched: isFetchedClaimFeesOverTime } = useClaimFeesOverTime(
    prizePool,
    uniqueBlockNumbers
  )

  const chartTimestamps = useMemo(() => {
    return [...periodicTimestamps, ...winTimestamps]
      .sort((a, b) => a - b)
      .filter((t) => t >= (awardedAt ?? 0)) // TODO: no idea why, but if we query `useClaimFeesOverTime` with t >= awardedAt it breaks
  }, [periodicTimestamps, winTimestamps, awardedAt])

  const chartData = useMemo(() => {
    const data: { name: number; claimFee: number; claimFeeUsd?: number }[] = []

    if (!!prizeToken) {
      chartTimestamps.forEach((timestamp) => {
        const blockNumber = blockNumbers[timestamp]

        if (!!blockNumber) {
          const rawClaimFee = claimFeesOverTime[blockNumber.toString()]

          if (!!rawClaimFee) {
            const claimFee = parseFloat(formatUnits(rawClaimFee, prizeToken.decimals))
            const claimFeeUsd =
              !!prizeToken.price && !!usdPrice
                ? (claimFee * prizeToken.price) / usdPrice
                : undefined

            data.push({ name: timestamp, claimFee, claimFeeUsd })
          }
        }
      })
    }

    return data
  }, [prizeToken, usdPrice, chartTimestamps, blockNumbers, claimFeesOverTime])

  const isFetched =
    isFetchedPrizeToken &&
    isFetchedTokenPrices &&
    isFetchedWins &&
    isFetchedWinBlocks &&
    isFetchedDrawStatus &&
    isFetchedPeriodicBlocks &&
    isFetchedClaimFeesOverTime

  if (isFetched && !!prizeToken && !!chartData?.length) {
    const isUsdValueDisplayed = !!prizeToken.price && !!usdPrice

    const getFormattedTooltipValue = (value: number) => {
      return isUsdValueDisplayed
        ? `$${formatNumberForDisplay(value, { maximumFractionDigits: 2 })}`
        : `${formatNumberForDisplay(value, { maximumFractionDigits: 4 })} ${prizeToken.symbol}`
    }

    return (
      <div
        className={classNames(
          'w-full flex flex-col gap-2 text-pt-purple-700 font-medium',
          className
        )}
      >
        <span className='ml-2 text-pt-purple-200 md:ml-6'>Claim Fees Over Time</span>
        <LineChart
          data={chartData}
          lines={[{ id: isUsdValueDisplayed ? 'claimFeeUsd' : 'claimFee' }]}
          // TODO: show txs when they occur on tooltip
          tooltip={{
            show: true,
            formatter: (value) => [getFormattedTooltipValue(value), 'Claim Fee'],
            labelFormatter: (label) => getSimpleTime(Number(label))
          }}
          xAxis={{
            type: 'number',
            domain: ['dataMin', 'dataMax'],
            ticks: chartTimestamps,
            interval: 'preserveStart',
            minTickGap: 50,
            tickFormatter: (tick) => getSimpleTime(Number(tick))
          }}
          yAxis={{
            tickFormatter: (tick) =>
              isUsdValueDisplayed ? `$${tick}` : `${tick} ${prizeToken.symbol}`
          }}
        />
      </div>
    )
  }

  return <></>
}
