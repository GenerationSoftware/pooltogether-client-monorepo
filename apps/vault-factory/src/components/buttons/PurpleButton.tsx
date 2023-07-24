import { Button, ButtonProps } from '@shared/ui'
import classNames from 'classnames'

interface PurpleButtonProps extends ButtonProps {
  innerClassName?: string
}

export const PurpleButton = (props: PurpleButtonProps) => {
  const { children, className, innerClassName, ...rest } = props

  return (
    <Button
      color='purple'
      className={classNames(
        'bg-pt-purple-400 border-pt-purple-400 hover:bg-pt-purple-500 focus:outline-transparent',
        className
      )}
      {...rest}
    >
      <span className={classNames('text-pt-purple-50', innerClassName)}>{children}</span>
    </Button>
  )
}
