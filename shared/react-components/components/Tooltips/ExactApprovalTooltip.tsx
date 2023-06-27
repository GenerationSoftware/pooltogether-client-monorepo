import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Tooltip } from '@shared/ui'
import classNames from 'classnames'

export interface ExactApprovalTooltipProps {
  tokenSymbol: string
  iconSize?: 'sm' | 'md' | 'lg'
  className?: string
  iconClassName?: string
}

export const ExactApprovalTooltip = (props: ExactApprovalTooltipProps) => {
  const { tokenSymbol, iconSize, className, iconClassName } = props

  return (
    <Tooltip
      content={
        <div className={classNames('max-w-[16ch] text-center', className)}>
          <span>You'll give your approval to deposit a specific amount of {tokenSymbol}</span>
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
