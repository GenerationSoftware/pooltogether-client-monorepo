import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Token } from '@shared/types'
import { Tooltip } from '@shared/ui'
import { formatBigIntForDisplay } from '@shared/utilities'
import classNames from 'classnames'

export interface ReserveTooltipProps {
  reserve: { current: bigint; forOpenDraw: bigint }
  token: Token
  iconSize?: 'sm' | 'md' | 'lg'
  className?: string
  iconClassName?: string
}

export const ReserveTooltip = (props: ReserveTooltipProps) => {
  const { reserve, token, iconSize, className, iconClassName } = props

  return (
    <Tooltip
      content={
        <div className={classNames('max-w-[32ch] flex flex-col gap-2 text-start', className)}>
          <span>
            Current:{' '}
            {formatBigIntForDisplay(reserve.current, token.decimals, {
              maximumFractionDigits: 1
            })}{' '}
            {token.symbol}
          </span>
          <span>
            Open Draw:{' '}
            {formatBigIntForDisplay(reserve.forOpenDraw, token.decimals, {
              maximumFractionDigits: 1
            })}{' '}
            {token.symbol}
          </span>
        </div>
      }
    >
      <InformationCircleIcon
        className={classNames(
          {
            'h-6 w-6': iconSize === 'lg',
            'h-5 w-5': iconSize === 'md' || !iconSize,
            'h-3 w-3': iconSize === 'sm'
          },
          iconClassName
        )}
      />
    </Tooltip>
  )
}
