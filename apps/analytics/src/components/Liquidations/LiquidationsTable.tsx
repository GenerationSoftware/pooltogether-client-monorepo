import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeTokenPrice } from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { MAX_UINT_256, SECONDS_PER_HOUR } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import Image from 'next/image'
import { useMemo } from 'react'
import { currentTimestampAtom } from 'src/atoms'
import { Address, Block } from 'viem'
import { useLiquidationEvents } from '@hooks/useLiquidationEvents'
import { LiquidationsTableRow } from './LiquidationsTableRow'

interface LiquidationsTableProps {
  prizePool: PrizePool
  minBlock?: Block
  maxBlock?: Block
  className?: string
}

export const LiquidationsTable = (props: LiquidationsTableProps) => {
  const { prizePool, minBlock, maxBlock, className } = props

  const currentTimestamp = useAtomValue(currentTimestampAtom)

  const { data: liquidationEvents, isFetched: isFetchedLiquidationEvents } =
    useLiquidationEvents(prizePool)

  const { data: prizeToken } = usePrizeTokenPrice(prizePool)

  const validLiquidationEvents = useMemo(() => {
    return (
      liquidationEvents?.filter(
        (event) =>
          event.blockNumber >= (minBlock?.number ?? 0n) &&
          event.blockNumber <= (maxBlock?.number ?? MAX_UINT_256)
      ) ?? []
    )
  }, [liquidationEvents, minBlock, maxBlock])

  const lpAddresses = useMemo(() => {
    const addresses = new Set<Address>()
    validLiquidationEvents.forEach((event) => {
      addresses.add(event.args.liquidationPair)
    })
    return [...addresses]
  }, [validLiquidationEvents])

  if (!isFetchedLiquidationEvents || !prizeToken) {
    return <Spinner className='after:border-y-pt-purple-800' />
  }

  const minTimestamp = Number(minBlock?.timestamp ?? 0)
  const maxTimestamp = Number(maxBlock?.timestamp ?? currentTimestamp)
  const hours = Math.round((maxTimestamp - minTimestamp) / SECONDS_PER_HOUR)
  const timeText = minTimestamp === 0 ? `All time` : `${hours}hr`

  if (validLiquidationEvents.length === 0) {
    return (
      <span className='flex gap-2 items-center'>
        No claims so far... <Image src='/thinkies.png' width={24} height={24} alt='thinkies' />
      </span>
    )
  }

  const gridClassName =
    'w-full grid gap-12 grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] px-4'

  return (
    <div className={classNames('w-full flex flex-col gap-6 items-center', className)}>
      <span className='text-center text-3xl font-semibold text-pt-purple-500'>
        {timeText} yield liquidations
      </span>
      <LiquidationsTableHeaders className={gridClassName} />
      {lpAddresses.map((lpAddress) => (
        <LiquidationsTableRow
          key={`lpLiquidations-${lpAddress}`}
          prizePool={prizePool}
          lpAddress={lpAddress}
          liquidations={validLiquidationEvents}
          prizeToken={prizeToken}
          className={gridClassName}
        />
      ))}
    </div>
  )
}

interface LiquidationsTableHeadersProps {
  className?: string
}

const LiquidationsTableHeaders = (props: LiquidationsTableHeadersProps) => {
  const { className } = props

  return (
    <div className={classNames('text-sm text-pt-purple-400', className)}>
      <span>Liquidation Pair</span>
      <span>Yield Auctioned</span>
      <span>Avg. Liquidation Price</span>
      <span>Current Available Yield</span>
      <span>Avg. Efficiency</span>
    </div>
  )
}
