import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useSelectedVault } from '@generationsoftware/hyperstructure-react-hooks'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { Button, ButtonProps } from '@shared/ui'
import classNames from 'classnames'

interface DepositButtonProps extends Omit<ButtonProps, 'onClick'> {
  vault: Vault
}

export const DepositButton = (props: DepositButtonProps) => {
  const { vault, children, className, disabled, ...rest } = props

  const { setIsModalOpen } = useIsModalOpen(MODAL_KEYS.deposit)

  const { setSelectedVaultById } = useSelectedVault()

  const handleClick = () => {
    setSelectedVaultById(vault.id)
    setIsModalOpen(true)
  }

  const isDeprecated = vault.tags?.includes('deprecated')

  return (
    <Button
      onClick={handleClick}
      className={classNames('w-24', className)}
      disabled={isDeprecated || disabled}
      {...rest}
    >
      {children ?? 'Deposit'}
    </Button>
  )
}
