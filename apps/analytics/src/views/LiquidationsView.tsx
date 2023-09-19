import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { PRIZE_POOLS, SECONDS_PER_DAY, sToMs } from '@shared/utilities'
import classNames from 'classnames'
import { useAtom } from 'jotai'
import { useEffect, useMemo } from 'react'
import { currentTimestampAtom } from 'src/atoms'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { LiquidationsTable } from '@components/Liquidations/LiquidationsTable'
import { useBlockAtTimestamp } from '@hooks/useBlockAtTimestamp'
import { useLiquidationEvents } from '@hooks/useLiquidationEvents'

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
      options: { prizeTokenAddress: Address; drawPeriodInSeconds: number; tierShares: number }
    }

    return new PrizePool(
      prizePoolInfo.chainId,
      prizePoolInfo.address,
      publicClient,
      prizePoolInfo.options
    )
  }, [chainId])

  const { data: minBlock } = useBlockAtTimestamp(
    prizePool.chainId,
    currentTimestamp - SECONDS_PER_DAY
  )

  const { refetch: refetchLiquidationEvents } = useLiquidationEvents(prizePool)

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
