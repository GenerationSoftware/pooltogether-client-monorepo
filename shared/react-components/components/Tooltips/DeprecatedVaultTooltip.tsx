import { Tooltip } from '@shared/ui'
import classNames from 'classnames'
import { ReactNode } from 'react'

export interface DeprecatedVaultTooltipProps {
  children: ReactNode
  intl?: string
  className?: string
}

export const DeprecatedVaultTooltip = (props: DeprecatedVaultTooltipProps) => {
  const { children, intl, className } = props

  return (
    <Tooltip
      content={
        <div className={classNames('max-w-[32ch] text-center', className)}>
          <span>
            {intl ??
              'This vault has been deprecated. It may still be eligible to win prizes, but we encourage users to migrate to other vaults.'}
          </span>
        </div>
      }
      fullSized={true}
    >
      {children}
    </Tooltip>
  )
}
