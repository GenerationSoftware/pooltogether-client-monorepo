import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useSelectedVault } from '@generationsoftware/hyperstructure-react-hooks'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { Button, ButtonProps } from '@shared/ui'
import classNames from 'classnames'

export interface WithdrawButtonProps extends Omit<ButtonProps, 'onClick'> {
  vault: Vault
  extraOnClick?: () => void
}

export const WithdrawButton = (props: WithdrawButtonProps) => {
  const { vault, extraOnClick, children, className, ...rest } = props

  const { setIsModalOpen } = useIsModalOpen(MODAL_KEYS.withdraw)

  const { setSelectedVaultById } = useSelectedVault()

  const handleClick = () => {
    setSelectedVaultById(vault.id)
    extraOnClick?.()
    setIsModalOpen(true)
  }

  return (
    <Button onClick={handleClick} className={classNames('w-24', className)} {...rest}>
      {children ?? 'Withdraw'}
    </Button>
  )
}
