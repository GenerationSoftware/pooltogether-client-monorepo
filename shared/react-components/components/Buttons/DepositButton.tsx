import { Vault } from '@generationsoftware/hyperstructure-client-js'
// import { useSelectedVault } from '@generationsoftware/hyperstructure-react-hooks'
// import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { Button, ButtonProps } from '@shared/ui'
import classNames from 'classnames'

interface DepositButtonProps extends Omit<ButtonProps, 'onClick'> {
  vault: Vault
}

export const DepositButton = (props: DepositButtonProps) => {
  const { vault, children, className, ...rest } = props

  // const { setIsModalOpen } = useIsModalOpen(MODAL_KEYS.deposit)

  // const { setSelectedVaultById } = useSelectedVault()

  // const handleClick = () => {
  //   setSelectedVaultById(vault.id)
  //   setIsModalOpen(true)
  // }

  return (
    <Button className={classNames('w-24', className)} {...rest} disabled={true}>
      {children ?? 'Deposit'}
    </Button>
  )

  // return (
  //   <Button onClick={handleClick} className={classNames('w-24', className)} {...rest}>
  //     {children ?? 'Deposit'}
  //   </Button>
  // )
}
