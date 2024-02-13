import { useTransferEvents } from '@generationsoftware/hyperstructure-react-hooks'
import { Token } from '@shared/types'
import { Spinner } from '@shared/ui'
import { DEAD_ADDRESS, formatBigIntForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'
import { BURN_ADDRESSES, QUERY_START_BLOCK, VAULT_LPS } from '@constants/config'

interface BurnHeaderProps {
  prizeToken: Token
  className?: string
}

export const BurnHeader = (props: BurnHeaderProps) => {
  const { prizeToken, className } = props

  const lpAddresses = VAULT_LPS[prizeToken.chainId] ?? []
  const miscBurnAddresses = BURN_ADDRESSES[prizeToken.chainId] ?? []

  const { data: burnTxs } = useTransferEvents(prizeToken.chainId, prizeToken.address, {
    to: [...lpAddresses, ...miscBurnAddresses, DEAD_ADDRESS],
    fromBlock: QUERY_START_BLOCK[prizeToken.chainId]
  })

  const totalBurned = useMemo(() => {
    return burnTxs?.reduce((a, b) => a + b.args.value, 0n)
  }, [burnTxs])

  return (
    <div className={classNames('flex flex-col items-center text-pt-purple-300', className)}>
      <span>Total {prizeToken.symbol} Burned:</span>
      <span className='flex gap-1 items-center text-pt-purple-100'>
        {totalBurned !== undefined ? (
          <>
            <span className='text-2xl'>🔥</span>
            <span className='text-4xl font-semibold'>
              {formatBigIntForDisplay(totalBurned, prizeToken.decimals, {
                hideZeroes: true
              })}
            </span>
            <span>{prizeToken.symbol}</span>
            <span className='text-2xl'>🔥</span>
          </>
        ) : (
          <Spinner className='after:border-y-pt-purple-300' />
        )}
      </span>
    </div>
  )
}
