import classNames from 'classnames'
import { Card as FlowbiteCard, CardProps as FlowbiteCardProps } from 'flowbite-react'

export interface CardProps extends FlowbiteCardProps {
  wrapperClassName?: string
}

export const Card = (props: CardProps) => {
  const { wrapperClassName, className, ...rest } = props

  return (
    <FlowbiteCard
      theme={{
        root: {
          base: 'flex bg-pt-transparent rounded-lg shadow-md',
          children: classNames('flex h-full flex-col justify-center px-8 py-6 md:py-8', className)
        }
      }}
      className={classNames(wrapperClassName)}
      {...rest}
    />
  )
}
