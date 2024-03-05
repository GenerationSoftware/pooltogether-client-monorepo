import { useTransferEvents } from '@generationsoftware/hyperstructure-react-hooks'
import { Token } from '@shared/types'
import { formatBigIntForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'
import { Block } from 'viem'
import { BURN_SETTINGS, QUERY_START_BLOCK } from '@constants/config'

interface RecentBurnStatsProps {
  burnToken: Token
  minBlock: Block
  label: string
  className?: string
}

export const RecentBurnStats = (props: RecentBurnStatsProps) => {
  const { burnToken, minBlock, label, className } = props

  const { data: burnEvents } = useTransferEvents(burnToken.chainId, burnToken.address, {
    to: BURN_SETTINGS[burnToken.chainId].burnAddresses,
    fromBlock: QUERY_START_BLOCK[burnToken.chainId]
  })

  const burned = useMemo(() => {
    const validBurnEvents =
      burnEvents?.filter((event) => event.blockNumber >= (minBlock.number ?? 0n)) ?? []
    return validBurnEvents.reduce((a, b) => a + b.args.value, 0n)
  }, [burnEvents, minBlock])

  if (!!burned) {
    const formattedBurnedAmount = formatBigIntForDisplay(burned, burnToken.decimals, {
      hideZeroes: true
    })

    return (
      <div className={classNames('flex gap-2 items-center', className)}>
        <span>{label}:</span>
        <span className='flex gap-1 items-center text-pt-purple-300'>
          <span className='text-lg font-medium'>{formattedBurnedAmount}</span>
          <span className='text-sm'>{burnToken.symbol}</span>
        </span>
      </div>
    )
  }

  return <></>
}
