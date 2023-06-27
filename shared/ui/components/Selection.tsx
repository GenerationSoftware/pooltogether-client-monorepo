import classNames from 'classnames'
import { ReactNode } from 'react'
import { Button, ButtonProps } from './Button'

export interface SelectionItem {
  id: string
  content: ReactNode
  onClick?: () => void
  disabled?: boolean
  hidden?: boolean
  className?: string
}

export interface SelectionProps {
  items: SelectionItem[]
  activeItem: string
  className?: string
  buttonColor?: ButtonProps['color']
}

export const Selection = (props: SelectionProps) => {
  const { items, activeItem, className, buttonColor } = props

  return (
    <div className={classNames('flex gap-2 lg:gap-4', className)}>
      {items.map((item) => {
        return (
          <Button
            key={`sl-${item.id}`}
            color={buttonColor}
            outline={item.id !== activeItem}
            className={item.className}
            disabled={item.disabled}
            hidden={item.hidden}
            onClick={item.onClick}
          >
            {item.content}
          </Button>
        )
      })}
    </div>
  )
}
