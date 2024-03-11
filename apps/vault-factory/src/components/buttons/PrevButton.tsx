import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { useVaultCreationSteps } from '@hooks/useVaultCreationSteps'
import { PurpleButton, PurpleButtonProps } from './PurpleButton'

interface PrevButtonProps extends Omit<PurpleButtonProps, 'outline' | 'children'> {}

export const PrevButton = (props: PrevButtonProps) => {
  const { onClick, className, innerClassName, ...rest } = props

  const { prevStep } = useVaultCreationSteps()

  return (
    <PurpleButton
      onClick={onClick ?? prevStep}
      outline={true}
      className={classNames('w-28', className)}
      innerClassName={classNames('flex gap-2 items-center', innerClassName)}
      {...rest}
    >
      <ArrowLeftIcon className='w-4 h-4' /> Previous
    </PurpleButton>
  )
}
