import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Tooltip } from '@shared/ui'
import classNames from 'classnames'

export interface PrizePowerTooltipProps {
  iconSize?: 'sm' | 'md' | 'lg'
  className?: string
  iconClassName?: string
}

export const PrizePowerTooltip = (props: PrizePowerTooltipProps) => {
  const { iconSize, className, iconClassName } = props

  return (
    <Tooltip
      content={
        <div className={classNames('flex flex-col max-w-[16ch] text-center', className)}>
          <span>Vaults with higher prize power have more chances to win</span>
          {/* TODO: add link */}
          <a href='#' className='text-pt-purple-500 underline'>
            Learn More
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
