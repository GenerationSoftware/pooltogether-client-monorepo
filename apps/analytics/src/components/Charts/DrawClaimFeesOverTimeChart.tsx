import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useBlocksAtTimestamps,
  usePrizeDrawWinners,
  usePrizeTokenPrice,
  useTokenPrices
} from '@generationsoftware/hyperstructure-react-hooks'
import { Token } from '@shared/types'
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
import { TooltipProps } from 'recharts'
import { currentTimestampAtom } from 'src/atoms'
import { Address, formatUnits } from 'viem'
import { useClaimFeesOverTime } from '@hooks/useClaimFeesOverTime'
import { useDrawStatus } from '@hooks/useDrawStatus'
import { LineChart } from './LineChart'

interface DrawClaimFeesOverTimeChartProps {
  prizePool: PrizePool
  drawId: number
  className?: string
}

interface Claim {
  txHash: `0x${string}`
  reward: number
  recipient: Address
  timestamp: number
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
    awardedAt,
    finalizedAt,
    isFetched: isFetchedDrawStatus
  } = useDrawStatus(prizePool, drawId)

  const currentTimestamp = useAtomValue(currentTimestampAtom)

  const periodicTimestamps = useMemo(() => {
    const timestamps: number[] = []

    if (!!awardedAt && !!finalizedAt) {
      const startTimestamp = awardedAt
      const endTimestamp = Math.min(finalizedAt, currentTimestamp)

      for (let i = startTimestamp; i < endTimestamp; i += SECONDS_PER_MINUTE * 5) {
        timestamps.push(i)
      }
      timestamps.push(endTimestamp)
    }

    return timestamps
  }, [awardedAt, finalizedAt, currentTimestamp])

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
    return [...periodicTimestamps, ...winTimestamps].sort((a, b) => a - b)
  }, [periodicTimestamps, winTimestamps, awardedAt])

  const chartData = useMemo(() => {
    const data: {
      name: number
      claimFee: number
      claimFeeUsd?: number
      claims: Claim[]
    }[] = []

    if (!!prizeToken) {
      const getPrizeTokenAmount = (rawAmount: bigint) => {
        return parseFloat(formatUnits(rawAmount, prizeToken.decimals))
      }

      const claimsQueue = !!drawWins
        ? [...drawWins]
            .sort((a, b) => a.timestamp - b.timestamp)
            .map((w) => ({
              txHash: w.txHash,
              reward:
                !!prizeToken.price && !!usdPrice
                  ? (getPrizeTokenAmount(w.claimReward) * prizeToken.price) / usdPrice
                  : getPrizeTokenAmount(w.claimReward),
              recipient: w.claimRewardRecipient,
              timestamp: w.timestamp
            }))
        : []

      chartTimestamps.forEach((timestamp, i) => {
        const blockNumber = blockNumbers[timestamp]

        if (!!blockNumber) {
          const rawClaimFee = claimFeesOverTime[blockNumber.toString()]

          if (!!rawClaimFee) {
            const claimFee = getPrizeTokenAmount(rawClaimFee)
            const claimFeeUsd =
              !!prizeToken.price && !!usdPrice
                ? (claimFee * prizeToken.price) / usdPrice
                : undefined

            const claims: Claim[] = []

            if (i === chartTimestamps.length - 1) {
              claims.push(...claimsQueue.splice(0))
            } else {
              const firstInvalidClaimIndex = claimsQueue.findIndex(
                (c) => c.timestamp >= chartTimestamps[i + 1]
              )

              if (firstInvalidClaimIndex !== -1) {
                claims.push(...claimsQueue.splice(0, firstInvalidClaimIndex))
              }
            }

            data.push({ name: timestamp, claimFee, claimFeeUsd, claims })
          }
        }
      })
    }

    return data
  }, [prizeToken, usdPrice, drawWins, blockNumbers, claimFeesOverTime, chartTimestamps])

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
          tooltip={{
            show: true,
            content: <Tooltip prizeToken={prizeToken} />
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

const Tooltip = (props: TooltipProps<number, string | number> & { prizeToken: Token }) => {
  const { active, payload: _payload, label, prizeToken } = props

  if (active && !!_payload && !!_payload.length) {
    const payload = _payload[0].payload as {
      claimFee: number
      claimFeeUsd?: number
      claims: Claim[]
    }

    const time = getSimpleTime(Number(label))

    const formattedClaimFee = !!payload.claimFeeUsd
      ? `$${formatNumberForDisplay(payload.claimFeeUsd, { maximumFractionDigits: 2 })}`
      : `${formatNumberForDisplay(payload.claimFee, { maximumFractionDigits: 4 })} ${
          prizeToken.symbol
        }`

    const numClaims = payload.claims.length

    return (
      <div className='flex flex-col p-[10px] bg-white border border-[#cccccc]'>
        <span>{time}</span>
        <span className='py-1' style={{ color: _payload[0].color }}>
          Claim Fee: {formattedClaimFee}
        </span>
        {!!numClaims && <span>+{numClaims.toLocaleString()} Prize Claims</span>}
      </div>
    )
  }

  return <></>
}
