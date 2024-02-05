import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Intl } from '@shared/types'
import { Tooltip } from '@shared/ui'
import classNames from 'classnames'

export interface ApprovalTooltipProps {
  tokenSymbol: string
  iconSize?: 'sm' | 'md' | 'lg'
  intl?: Intl<'approval'>
  className?: string
  iconClassName?: string
}

export const ApprovalTooltip = (props: ApprovalTooltipProps) => {
  const { tokenSymbol, iconSize, intl, className, iconClassName } = props

  return (
    <Tooltip
      content={
        <div className={classNames('max-w-[16ch] text-center', className)}>
          <span>
            {intl?.('approval', { symbol: tokenSymbol }) ??
              `You'll give your approval to deposit a specific amount of ${tokenSymbol}`}
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
