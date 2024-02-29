import { useTransferEvents } from '@generationsoftware/hyperstructure-react-hooks'
import { Token } from '@shared/types'
import { DEAD_ADDRESS, formatBigIntForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'
import { Block } from 'viem'
import { BURN_ADDRESSES, QUERY_START_BLOCK } from '@constants/config'

interface RecentBurnStatsProps {
  prizeToken: Token
  minBlock: Block
  label: string
  className?: string
}

export const RecentBurnStats = (props: RecentBurnStatsProps) => {
  const { prizeToken, minBlock, label, className } = props

  const burnAddresses = BURN_ADDRESSES[prizeToken.chainId] ?? []

  const { data: burnEvents } = useTransferEvents(prizeToken.chainId, prizeToken.address, {
    to: [DEAD_ADDRESS, ...burnAddresses],
    fromBlock: QUERY_START_BLOCK[prizeToken.chainId]
  })

  const burned = useMemo(() => {
    const validBurnEvents =
      burnEvents?.filter((event) => event.blockNumber >= (minBlock.number ?? 0n)) ?? []
    const sumBurnedAmount = validBurnEvents.reduce((a, b) => a + b.args.value, 0n)
    return sumBurnedAmount
  }, [burnEvents, minBlock])

  if (!!burned) {
    const formattedBurnedAmount = formatBigIntForDisplay(burned, prizeToken.decimals, {
      hideZeroes: true
    })

    return (
      <div className={classNames('flex gap-2 items-center', className)}>
        <span>{label}:</span>
        <span className='flex gap-1 items-center text-pt-purple-300'>
          <span className='text-lg font-medium'>{formattedBurnedAmount}</span>
          <span className='text-sm'>{prizeToken.symbol}</span>
        </span>
      </div>
    )
  }

  return <></>
}
