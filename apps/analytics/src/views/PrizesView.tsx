import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useDrawAwardedEvents,
  useRelayAuctionEvents,
  useRngAuctionEvents,
  useRngL1RelayMsgEvents,
  useRngL2RelayMsgEvents
} from '@generationsoftware/hyperstructure-react-hooks'
import { PRIZE_POOLS, sToMs } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useEffect, useMemo } from 'react'
import { selectedDrawIdAtom } from 'src/atoms'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { DrawAvgClaimFeesChart } from '@components/Charts/DrawAvgClaimFeesChart'
import { DrawSelector } from '@components/Draws/DrawSelector'
import { DrawStatusBadge } from '@components/Draws/DrawStatusBadge'
import { PrizesTable } from '@components/Prizes/PrizesTable'
import { QUERY_START_BLOCK, RELAY_ORIGINS } from '@constants/config'

interface PrizesViewProps {
  chainId: number
  className?: string
}

export const PrizesView = (props: PrizesViewProps) => {
  const { chainId, className } = props

  const publicClient = usePublicClient({ chainId })

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

  const originChainId = !!prizePool ? RELAY_ORIGINS[prizePool.chainId] : undefined
  const fromBlock = !!prizePool ? QUERY_START_BLOCK[prizePool.chainId] : undefined
  const originFromBlock = !!originChainId ? QUERY_START_BLOCK[originChainId] : undefined

  const { refetch: refetchRngAuctionEvents } = useRngAuctionEvents(originChainId as number, {
    fromBlock: originFromBlock
  })
  const { refetch: refetchRngL1RelayMsgEvents } = useRngL1RelayMsgEvents(originChainId as number, {
    fromBlock: originFromBlock
  })
  const { refetch: refetchRelayAuctionEvents } = useRelayAuctionEvents(prizePool?.chainId, {
    fromBlock
  })
  const { refetch: refetchDrawAwardedEvents } = useDrawAwardedEvents(prizePool, { fromBlock })
  const { refetch: refetchRngL2RelayMsgEvents } = useRngL2RelayMsgEvents(prizePool?.chainId, {
    fromBlock
  })

  // Automatic data refetching
  useEffect(() => {
    const interval = setInterval(() => {
      refetchRngAuctionEvents()
      refetchRngL1RelayMsgEvents()
      refetchRelayAuctionEvents()
      refetchDrawAwardedEvents()
      refetchRngL2RelayMsgEvents()
    }, sToMs(300))

    return () => clearInterval(interval)
  }, [])

  const drawIdSelected = useAtomValue(selectedDrawIdAtom)

  return (
    <div className={classNames('w-full flex flex-col grow gap-2 items-center md:gap-6', className)}>
      {!!drawIdSelected && (
        <>
          <DrawStatusBadge prizePool={prizePool} drawId={drawIdSelected} />
          <DrawAvgClaimFeesChart
            prizePool={prizePool}
            drawId={drawIdSelected}
            className='max-w-4xl'
          />
          <PrizesTable prizePool={prizePool} drawId={drawIdSelected} className='md:mt-6' />
        </>
      )}
      <DrawSelector prizePool={prizePool} excludeDrawStatus={['open', 'closed']} />
    </div>
  )
}
