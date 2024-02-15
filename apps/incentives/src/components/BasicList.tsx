import classNames from 'classnames'
import { ReactNode } from 'react'

interface BasicListProps {
  children: ReactNode
  className?: string
}

export const BasicList = (props: BasicListProps) => {
  const { children, className } = props

  return <ul className={classNames('flex flex-col gap-2 pl-8 list-disc', className)}>{children}</ul>
}
