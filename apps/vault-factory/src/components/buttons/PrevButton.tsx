import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { useSteps } from '@hooks/useSteps'
import { PurpleButton, PurpleButtonProps } from './PurpleButton'

interface PrevButtonProps extends Omit<PurpleButtonProps, 'onClick' | 'outline' | 'children'> {}

export const PrevButton = (props: PrevButtonProps) => {
  const { className, innerClassName, ...rest } = props

  const { prevStep } = useSteps()

  return (
    <PurpleButton
      onClick={prevStep}
      outline={true}
      className={classNames('w-28', className)}
      innerClassName={classNames('flex gap-2 items-center', innerClassName)}
      {...rest}
    >
      <ArrowLeftIcon className='w-4 h-4' /> Previous
    </PurpleButton>
  )
}
