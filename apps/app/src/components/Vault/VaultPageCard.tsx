import { Card } from '@shared/ui'
import classNames from 'classnames'
import { ReactNode } from 'react'

interface VaultPageCardProps {
  title: ReactNode
  children: ReactNode
  className?: string
  wrapperClassName?: string
}

export const VaultPageCard = (props: VaultPageCardProps) => {
  const { title, children, className, wrapperClassName } = props

  return (
    <Card className={classNames('text-center', className)} wrapperClassName={wrapperClassName}>
      <span className='mb-2 text-xl text-pt-purple-300 font-semibold md:mb-3 md:text-2xl'>
        {title}
      </span>
      <div className='grow flex flex-col items-center justify-center gap-2'>{children}</div>
    </Card>
  )
}
