import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeTokenData } from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { formatBigIntForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import { useReserve } from '@hooks/useReserve'
import { ReserveTooltip } from './ReserveTooltip'

interface ReserveHeaderProps {
  prizePool: PrizePool
  className?: string
}

export const ReserveHeader = (props: ReserveHeaderProps) => {
  const { prizePool, className } = props

  const { data: reserve } = useReserve(prizePool)

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  return (
    <div className={classNames('flex flex-col items-center', className)}>
      <span>Current Reserve:</span>
      <span className='flex gap-1 items-center text-pt-purple-500'>
        <span className='text-4xl font-semibold'>
          {!!reserve && !!prizeToken ? (
            formatBigIntForDisplay(reserve.current + reserve.pending, prizeToken.decimals, {
              hideZeroes: true
            })
          ) : (
            <Spinner className='after:border-y-pt-purple-800' />
          )}
        </span>{' '}
        {prizeToken?.symbol}
        {!!reserve && !!prizeToken && <ReserveTooltip reserve={reserve} token={prizeToken} />}
      </span>
    </div>
  )
}
