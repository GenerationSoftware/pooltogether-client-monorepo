import { ArrowRightIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { PurpleButton, PurpleButtonProps } from './PurpleButton'

interface NextButtonProps extends Omit<PurpleButtonProps, 'type' | 'children'> {}

export const NextButton = (props: NextButtonProps) => {
  const { className, innerClassName, ...rest } = props

  return (
    <PurpleButton
      type='submit'
      className={classNames('w-28', className)}
      innerClassName={classNames('flex gap-2 items-center', innerClassName)}
      {...rest}
    >
      Next <ArrowRightIcon className='w-4 h-4' />
    </PurpleButton>
  )
}
