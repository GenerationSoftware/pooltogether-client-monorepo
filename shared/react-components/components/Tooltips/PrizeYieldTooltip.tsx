import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { LINKS, Tooltip } from '@shared/ui'
import classNames from 'classnames'

export interface PrizeYieldTooltipProps {
  iconSize?: 'sm' | 'md' | 'lg'
  intl?: { text?: string; learnMore?: string }
  className?: string
  iconClassName?: string
}

export const PrizeYieldTooltip = (props: PrizeYieldTooltipProps) => {
  const { iconSize, intl, className, iconClassName } = props

  return (
    <Tooltip
      content={
        <div className={classNames('flex flex-col max-w-[17ch] text-center', className)}>
          <span>
            {intl?.text ?? "A recent average of a vault's yield contributions to the prize pool"}
          </span>
          <a href={LINKS.prizeYieldDocs} target='_blank' className='text-pt-purple-500 underline'>
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
