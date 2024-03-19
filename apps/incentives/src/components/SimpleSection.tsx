import classNames from 'classnames'
import { ReactNode } from 'react'

interface SimpleSectionProps {
  title: string
  content: ReactNode
  className?: string
}

export const SimpleSection = (props: SimpleSectionProps) => {
  const { title, content, className } = props

  return (
    <section className={classNames('flex flex-col gap-2 text-xl', className)}>
      <span className='text-pt-purple-300 font-semibold'>{title}</span>
      {content}
    </section>
  )
}
