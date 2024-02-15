import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useBlockAtTimestamp,
  useLiquidationEvents
} from '@generationsoftware/hyperstructure-react-hooks'
import { PRIZE_POOLS, SECONDS_PER_DAY, sToMs } from '@shared/utilities'
import classNames from 'classnames'
import { useAtom } from 'jotai'
import { useEffect, useMemo } from 'react'
import { currentTimestampAtom } from 'src/atoms'
import { Address, PublicClient } from 'viem'
import { usePublicClient } from 'wagmi'
import { LiquidationsTable } from '@components/Liquidations/LiquidationsTable'
import { QUERY_START_BLOCK } from '@constants/config'

interface LiquidationsViewProps {
  chainId: number
  className?: string
}

export const LiquidationsView = (props: LiquidationsViewProps) => {
  const { chainId, className } = props

  const publicClient = usePublicClient({ chainId })

  const [currentTimestamp, setCurrentTimestamp] = useAtom(currentTimestampAtom)

  const prizePool = useMemo(() => {
    const prizePoolInfo = PRIZE_POOLS.find((pool) => pool.chainId === chainId) as {
      chainId: number
      address: Address
      options: {
        prizeTokenAddress: Address
        drawPeriodInSeconds: number
        tierShares: number
        reserveShares: number
      }
    }

    return new PrizePool(
      prizePoolInfo.chainId,
      prizePoolInfo.address,
      publicClient as PublicClient,
      prizePoolInfo.options
    )
  }, [chainId, publicClient])

  const { data: minBlock } = useBlockAtTimestamp(
    prizePool.chainId,
    currentTimestamp - SECONDS_PER_DAY
  )

  const fromBlock = !!prizePool ? QUERY_START_BLOCK[prizePool.chainId] : undefined

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

  return (
    <div className={classNames('w-full flex flex-col gap-12 items-center', className)}>
      {!!minBlock && <LiquidationsTable prizePool={prizePool} minBlock={minBlock} />}
    </div>
  )
}
