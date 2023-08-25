import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { LINKS, Tooltip } from '@shared/ui'
import classNames from 'classnames'

export interface PrizePowerTooltipProps {
  iconSize?: 'sm' | 'md' | 'lg'
  intl?: { text?: string; learnMore?: string }
  className?: string
  iconClassName?: string
}

export const PrizePowerTooltip = (props: PrizePowerTooltipProps) => {
  const { iconSize, intl, className, iconClassName } = props

  return (
    <Tooltip
      content={
        <div className={classNames('flex flex-col max-w-[16ch] text-center', className)}>
          <span>
            {intl?.text ??
              'Vaults with higher prize power have a greater percentage of chances to win'}
          </span>
          <a href={LINKS.prizePowerDocs} className='text-pt-purple-500 underline'>
            {intl?.learnMore ?? 'Learn More'}
          </a>
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
