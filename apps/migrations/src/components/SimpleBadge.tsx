import classNames from 'classnames'
import { ReactNode } from 'react'

export interface SimpleBadgeProps {
  children: ReactNode
  className?: string
}

export const SimpleBadge = (props: SimpleBadgeProps) => {
  const { children, className } = props

  return (
    <div
      className={classNames(
        'flex items-center gap-1 px-3 py-2 text-lg bg-pt-transparent rounded-lg',
        'border border-pt-transparent',
        className
      )}
    >
      {children}
    </div>
  )
}
