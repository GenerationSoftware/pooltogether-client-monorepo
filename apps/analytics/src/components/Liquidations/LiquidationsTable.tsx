import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useLiquidationEvents } from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { getNiceNetworkNameByChainId, MAX_UINT_256, SECONDS_PER_HOUR } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import Image from 'next/image'
import { useMemo } from 'react'
import { currentTimestampAtom } from 'src/atoms'
import { Address, Block } from 'viem'
import { QUERY_START_BLOCK } from '@constants/config'
import { LiquidationsTableRow } from './LiquidationsTableRow'

export const liquidationHeaders = {
  pair: 'Liquidation Pair',
  auctioned: 'Yield Auctioned',
  price: 'Avg. Liquidation Price',
  available: 'Curr. Available Yield',
  efficiency: 'Avg. Efficiency'
}

interface LiquidationsTableProps {
  prizePool: PrizePool
  minBlock?: Block
  maxBlock?: Block
  className?: string
}

export const LiquidationsTable = (props: LiquidationsTableProps) => {
  const { prizePool, minBlock, maxBlock, className } = props

  const currentTimestamp = useAtomValue(currentTimestampAtom)

  const { data: liquidationEvents, isFetched: isFetchedLiquidationEvents } = useLiquidationEvents(
    prizePool?.chainId,
    { fromBlock: !!prizePool ? QUERY_START_BLOCK[prizePool.chainId] : undefined }
  )

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
      addresses.add(event.args.liquidationPair.toLowerCase() as Address)
    })
    return [...addresses]
  }, [validLiquidationEvents])

  if (!isFetchedLiquidationEvents) {
    return <Spinner className='after:border-y-pt-purple-300' />
  }

  const minTimestamp = Number(minBlock?.timestamp ?? 0)
  const maxTimestamp = Number(maxBlock?.timestamp ?? currentTimestamp)
  const hours = Math.round((maxTimestamp - minTimestamp) / SECONDS_PER_HOUR)
  const timeText = minTimestamp === 0 ? `All time` : `${hours}hr`

  if (validLiquidationEvents.length === 0) {
    return (
      <span className='flex gap-2 items-center'>
        No recent liquidations on {getNiceNetworkNameByChainId(prizePool.chainId)}...{' '}
        <Image src='/thinkies.png' width={24} height={24} alt='thinkies' />
      </span>
    )
  }

  const gridClassName =
    'w-full gap-y-6 grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] md:grid md:gap-x-12'

  return (
    <div className={classNames('w-full flex flex-col gap-6 items-center', className)}>
      <span className='text-center text-3xl font-semibold text-pt-purple-200'>
        {timeText} yield liquidations
      </span>
      <LiquidationsTableHeaders className={classNames('hidden px-4', gridClassName)} />
      {lpAddresses.map((lpAddress) => (
        <LiquidationsTableRow
          key={`lpLiquidations-${lpAddress}`}
          prizePool={prizePool}
          lpAddress={lpAddress}
          liquidations={validLiquidationEvents}
          className='py-3 px-4'
          gridClassName={classNames('flex flex-wrap', gridClassName)}
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
    <div className={classNames('text-sm text-pt-purple-300', className)}>
      <span>{liquidationHeaders.pair}</span>
      <span>{liquidationHeaders.auctioned}</span>
      <span>{liquidationHeaders.price}</span>
      <span>{liquidationHeaders.available}</span>
      <span>{liquidationHeaders.efficiency}</span>
    </div>
  )
}
