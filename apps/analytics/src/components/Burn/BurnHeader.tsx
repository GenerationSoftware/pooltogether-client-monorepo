import { useTransferEvents } from '@generationsoftware/hyperstructure-react-hooks'
import { Token } from '@shared/types'
import { Spinner } from '@shared/ui'
import { formatBigIntForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'
import { BURN_SETTINGS, QUERY_START_BLOCK } from '@constants/config'

interface BurnHeaderProps {
  burnToken: Token
  className?: string
}

export const BurnHeader = (props: BurnHeaderProps) => {
  const { burnToken, className } = props

  const { data: burnTxs } = useTransferEvents(burnToken.chainId, burnToken.address, {
    to: BURN_SETTINGS[burnToken.chainId].burnAddresses,
    fromBlock: QUERY_START_BLOCK[burnToken.chainId]
  })

  const totalBurned = useMemo(() => {
    return burnTxs?.reduce((a, b) => a + b.args.value, 0n)
  }, [burnTxs])

  return (
    <div className={classNames('flex flex-col items-center text-pt-purple-300', className)}>
      <span>{burnToken.symbol} Burned:</span>
      <span className='flex gap-1 items-center text-pt-purple-100'>
        {totalBurned !== undefined ? (
          <>
            <span className='text-2xl'>🔥</span>
            <span className='text-4xl font-semibold'>
              {formatBigIntForDisplay(totalBurned, burnToken.decimals, {
                hideZeroes: true
              })}
            </span>
            <span>{burnToken.symbol}</span>
            <span className='text-2xl'>🔥</span>
          </>
        ) : (
          <Spinner className='after:border-y-pt-purple-300' />
        )}
      </span>
    </div>
  )
}
