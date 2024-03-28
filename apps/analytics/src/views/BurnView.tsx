import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useBlockAtTimestamp,
  useLiquidationEvents,
  useToken
} from '@generationsoftware/hyperstructure-react-hooks'
import { PRIZE_POOLS, SECONDS_PER_DAY, sToMs } from '@shared/utilities'
import classNames from 'classnames'
import { useAtom } from 'jotai'
import { useEffect, useMemo } from 'react'
import { currentTimestampAtom } from 'src/atoms'
import { PublicClient } from 'viem'
import { usePublicClient } from 'wagmi'
import { BurnHeader } from '@components/Burn/BurnHeader'
import { RecentBurnStats } from '@components/Burn/RecentBurnStats'
import { BurnChart } from '@components/Charts/BurnChart'
import { BURN_SETTINGS, QUERY_START_BLOCK } from '@constants/config'

interface BurnViewProps {
  chainId: number
  className?: string
}

export const BurnView = (props: BurnViewProps) => {
  const { chainId, className } = props

  const publicClient = usePublicClient({ chainId })

  const [currentTimestamp, setCurrentTimestamp] = useAtom(currentTimestampAtom)

  const prizePool = useMemo(() => {
    const prizePoolInfo = PRIZE_POOLS.find(
      (pool) => pool.chainId === chainId
    ) as (typeof PRIZE_POOLS)[number]

    return new PrizePool(
      prizePoolInfo.chainId,
      prizePoolInfo.address,
      publicClient as PublicClient,
      prizePoolInfo.options
    )
  }, [chainId, publicClient])

  const fromBlock = !!prizePool ? QUERY_START_BLOCK[prizePool.chainId] : undefined

  const { data: minBlockDay } = useBlockAtTimestamp(
    prizePool.chainId,
    currentTimestamp - SECONDS_PER_DAY
  )

  const { data: minBlockWeek } = useBlockAtTimestamp(
    prizePool.chainId,
    currentTimestamp - SECONDS_PER_DAY * 7
  )

  const { data: burnToken } = useToken(chainId, BURN_SETTINGS[chainId]?.burnTokenAddress)

  const { refetch: refetchLiquidationEvents } = useLiquidationEvents(prizePool?.chainId, {
    fromBlock
  })

  // Automatic data refetching
  useEffect(() => {
    const interval = setInterval(() => {
      refetchLiquidationEvents()
      setCurrentTimestamp(Math.floor(Date.now() / 1_000))
    }, sToMs(300))

    return () => clearInterval(interval)
  }, [])

  if (!!prizePool && !!burnToken) {
    return (
      <div className={classNames('w-full flex flex-col gap-6 items-center', className)}>
        <div className='flex flex-col items-center text-pt-purple-400'>
          <BurnHeader burnToken={burnToken} className='mb-3' />
          {!!minBlockDay && (
            <RecentBurnStats burnToken={burnToken} minBlock={minBlockDay} label='Last 24 hours' />
          )}
          {!!minBlockWeek && (
            <RecentBurnStats burnToken={burnToken} minBlock={minBlockWeek} label='Last week' />
          )}
        </div>
        <BurnChart prizePool={prizePool} burnToken={burnToken} />
      </div>
    )
  }

  return <></>
}
