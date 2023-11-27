import { Button, ButtonProps } from '@shared/ui'
import classNames from 'classnames'

export interface PurpleButtonProps extends Omit<ButtonProps, 'color'> {
  innerClassName?: string
}

export const PurpleButton = (props: PurpleButtonProps) => {
  const { children, className, innerClassName, ...rest } = props

  return (
    <Button
      color='purple'
      className={classNames(
        'bg-pt-purple-600 border-pt-purple-600 hover:bg-pt-purple-700 focus:outline-transparent',
        className
      )}
      {...rest}
    >
      <span className={classNames('text-pt-purple-50 whitespace-nowrap', innerClassName)}>
        {children}
      </span>
    </Button>
  )
}
