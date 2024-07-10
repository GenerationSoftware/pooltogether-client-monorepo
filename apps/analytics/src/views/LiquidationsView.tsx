import {
  useBlockAtTimestamp,
  useLiquidationEvents
} from '@generationsoftware/hyperstructure-react-hooks'
import { SECONDS_PER_DAY, sToMs } from '@shared/utilities'
import classNames from 'classnames'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { currentTimestampAtom } from 'src/atoms'
import { LiquidationsTable } from '@components/Liquidations/LiquidationsTable'
import { QUERY_START_BLOCK } from '@constants/config'
import { usePrizePool } from '@hooks/usePrizePool'

interface LiquidationsViewProps {
  chainId: number
  className?: string
}

export const LiquidationsView = (props: LiquidationsViewProps) => {
  const { chainId, className } = props

  const [currentTimestamp, setCurrentTimestamp] = useAtom(currentTimestampAtom)

  const prizePool = usePrizePool(chainId)

  const { data: minBlock } = useBlockAtTimestamp(
    prizePool.chainId,
    currentTimestamp - SECONDS_PER_DAY
  )

  const { refetch: refetchLiquidationEvents } = useLiquidationEvents(prizePool?.chainId, {
    fromBlock: !!prizePool ? QUERY_START_BLOCK[prizePool.chainId] : undefined
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
