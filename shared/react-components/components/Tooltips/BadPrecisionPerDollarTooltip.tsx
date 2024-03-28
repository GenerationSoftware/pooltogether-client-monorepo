import { Tooltip } from '@shared/ui'
import classNames from 'classnames'
import { ReactNode } from 'react'

export interface BadPrecisionPerDollarTooltipProps {
  children: ReactNode
  intl?: string
  className?: string
}

export const BadPrecisionPerDollarTooltip = (props: BadPrecisionPerDollarTooltipProps) => {
  const { children, intl, className } = props

  return (
    <Tooltip
      content={
        <div className={classNames('max-w-[32ch] text-center', className)}>
          <span>
            {intl ??
              'This vault is likely to have rounding errors which may lead to lossy withdrawals.'}
          </span>
        </div>
      }
      fullSized={true}
    >
      {children}
    </Tooltip>
  )
}
