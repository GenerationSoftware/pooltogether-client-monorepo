import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Intl } from '@shared/types'
import { ExternalLink, Tooltip } from '@shared/ui'
import { LINKS } from '@shared/utilities'
import classNames from 'classnames'

export interface DelegationDescriptionTooltipProps {
  iconSize?: 'sm' | 'md' | 'lg'
  intl?: {
    tooltip?: Intl<'delegateDescription'>
    common?: Intl<'learnMore'>
  }
  className?: string
  iconClassName?: string
}

export const DelegationDescriptionTooltip = (props: DelegationDescriptionTooltipProps) => {
  const { iconSize, intl, className, iconClassName } = props

  return (
    <Tooltip
      content={
        <div className={classNames('max-w-[32ch] text-center', className)}>
          <span>
            {intl?.tooltip?.('delegateDescription') ??
              `By default the prize token holder is the delegated address. That can be overridden with delegation.`}
          </span>
          <ExternalLink href={LINKS.delegateDocs} className='text-pt-purple-400 ml-1' size='sm'>
            {intl?.common?.('learnMore') ?? 'Learn More'}
          </ExternalLink>
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
