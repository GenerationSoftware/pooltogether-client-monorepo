import { Tooltip } from '@shared/ui'
import classNames from 'classnames'
import { ReactNode } from 'react'

export interface WrongPrizePoolVaultTooltipProps {
  children: ReactNode
  intl?: string
  className?: string
}

export const WrongPrizePoolVaultTooltip = (props: WrongPrizePoolVaultTooltipProps) => {
  const { children, intl, className } = props

  return (
    <Tooltip
      content={
        <div className={classNames('max-w-[32ch] text-center', className)}>
          <span>
            {intl ?? 'This vault is connected to a prize pool not supported by this interface.'}
          </span>
        </div>
      }
      fullSized={true}
    >
      {children}
    </Tooltip>
  )
}
