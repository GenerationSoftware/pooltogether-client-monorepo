import { Vault } from '@pooltogether/hyperstructure-client-js'
import { useSelectedVault } from '@pooltogether/hyperstructure-react-hooks'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { Button, ButtonProps } from '@shared/ui'
import classNames from 'classnames'

interface WithdrawButtonProps extends Omit<ButtonProps, 'onClick'> {
  vault: Vault
}

export const WithdrawButton = (props: WithdrawButtonProps) => {
  const { vault, children, className, ...rest } = props

  const { setIsModalOpen } = useIsModalOpen(MODAL_KEYS.withdraw)

  const { setSelectedVaultById } = useSelectedVault()

  const handleClick = () => {
    setSelectedVaultById(vault.id)
    setIsModalOpen(true)
  }

  return (
    <Button onClick={handleClick} className={classNames('w-24', className)} {...rest}>
      {children ?? 'Withdraw'}
    </Button>
  )
}
