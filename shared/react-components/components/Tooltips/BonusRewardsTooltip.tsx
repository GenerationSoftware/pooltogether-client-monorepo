import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Tooltip } from '@shared/ui'
import classNames from 'classnames'

export interface BonusRewardsTooltipProps {
  iconSize?: 'sm' | 'md' | 'lg'
  intl?: string
  className?: string
  iconClassName?: string
}

export const BonusRewardsTooltip = (props: BonusRewardsTooltipProps) => {
  const { iconSize, intl, className, iconClassName } = props

  return (
    <Tooltip
      content={
        <div className={classNames('max-w-[17ch] text-center', className)}>
          <span>{intl ?? 'An estimate of current extra incentives for depositors'}</span>
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
