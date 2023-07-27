import { ArrowRightIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { PurpleButton, PurpleButtonProps } from './PurpleButton'

interface DeployVaultButtonProps extends PurpleButtonProps {}

export const DeployVaultButton = (props: DeployVaultButtonProps) => {
  const { className, innerClassName, ...rest } = props

  // TODO: send transaction, use toast, etc. on click
  return (
    <PurpleButton
      onClick={() => {}}
      className={classNames('w-36', className)}
      innerClassName={classNames('flex gap-2 items-center', innerClassName)}
      {...rest}
    >
      Deploy Vault <ArrowRightIcon className='w-4 h-4' />
    </PurpleButton>
  )
}
