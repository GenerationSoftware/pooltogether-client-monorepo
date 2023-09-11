import classNames from 'classnames'
import { ReactNode } from 'react'
import { Button, ButtonProps } from './Button'

export interface SelectionItem {
  id: string
  content: ReactNode
  onClick?: () => void
  disabled?: boolean
  hidden?: boolean
  noButton?: boolean
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
        const key = `sl-${item.id}`

        if (item.noButton) {
          return (
            <div key={key} onClick={item.onClick} className={item.className} hidden={item.hidden}>
              {item.content}
            </div>
          )
        } else {
          return (
            <Button
              key={key}
              onClick={item.onClick}
              color={buttonColor}
              outline={item.id !== activeItem}
              className={item.className}
              disabled={item.disabled}
              hidden={item.hidden}
            >
              {item.content}
            </Button>
          )
        }
      })}
    </div>
  )
}
