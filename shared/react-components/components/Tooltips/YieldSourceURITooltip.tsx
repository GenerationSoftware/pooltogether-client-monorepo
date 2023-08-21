import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Tooltip } from '@shared/ui'
import classNames from 'classnames'

export interface YieldSourceURITooltipProps {
  iconSize?: 'sm' | 'md' | 'lg'
  intl?: { text?: string }
  className?: string
  iconClassName?: string
}

export const YieldSourceURITooltip = (props: YieldSourceURITooltipProps) => {
  const { iconSize, intl, className, iconClassName } = props

  return (
    <Tooltip
      content={
        <div className={classNames('max-w-[16ch] text-center', className)}>
          <span>
            {intl?.text ??
              'Enter the URL of the yield source so users know what they are depositing into.'}
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
