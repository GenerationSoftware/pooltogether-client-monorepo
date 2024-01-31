import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useSelectedVault } from '@generationsoftware/hyperstructure-react-hooks'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { Button, ButtonProps } from '@shared/ui'
import classNames from 'classnames'

interface DelegateButtonProps extends Omit<ButtonProps, 'onClick'> {
  vault: Vault
  children?: ReactNode
  className?: string
  size?: string
}

export const DelegateButton = (props: DelegateButtonProps) => {
  const { vault, children, className, size, ...rest } = props

  const { setIsModalOpen } = useIsModalOpen(MODAL_KEYS.delegate)

  const { setSelectedVaultById } = useSelectedVault()

  const handleClick = () => {
    setSelectedVaultById(vault.id)
    setIsModalOpen(true)
  }

  return (
    <Button
      size={size}
      onClick={handleClick}
      className={classNames({
        'w-28 md:w-24 lg:w-12': size === 'sm'
      })}
      {...rest}
    >
      {children ?? 'Delegate'}
    </Button>
  )
}
