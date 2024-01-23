import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useSelectedVault } from '@generationsoftware/hyperstructure-react-hooks'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { Button, ButtonProps } from '@shared/ui'

interface DelegateButtonProps extends Omit<ButtonProps, 'onClick'> {
  vault: Vault
}

export const DelegateButton = (props: DelegateButtonProps) => {
  const { vault, children, className, ...rest } = props

  const { setIsModalOpen } = useIsModalOpen(MODAL_KEYS.delegate)

  const { setSelectedVaultById } = useSelectedVault()

  const handleClick = () => {
    setSelectedVaultById(vault.id)
    setIsModalOpen(true)
  }

  return (
    <Button size='sm' onClick={handleClick} {...rest}>
      {children ?? 'Delegate'}
    </Button>
  )
}
