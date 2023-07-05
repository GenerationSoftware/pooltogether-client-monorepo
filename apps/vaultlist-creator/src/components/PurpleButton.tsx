import { Button, ButtonProps } from '@shared/ui'
import classNames from 'classnames'

export const PurpleButton = (props: ButtonProps) => {
  const { children, className, ...rest } = props

  return (
    <Button
      color='purple'
      className={classNames(
        'bg-pt-purple-400 border-pt-purple-400 hover:bg-pt-purple-500 focus:!ring-0',
        className
      )}
      {...rest}
    >
      <span className='text-pt-purple-50'>{children}</span>
    </Button>
  )
}
