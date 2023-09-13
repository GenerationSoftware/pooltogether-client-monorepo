import classNames from 'classnames'
import { ReactNode } from 'react'

interface DrawCardItemTitleProps {
  children: ReactNode
  className?: string
}

export const DrawCardItemTitle = (props: DrawCardItemTitleProps) => {
  const { children, className } = props

  return <span className={classNames('text-sm text-pt-purple-500', className)}>{children}</span>
}
