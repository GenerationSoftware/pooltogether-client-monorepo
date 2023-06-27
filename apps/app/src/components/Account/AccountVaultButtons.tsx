import { Vault } from '@pooltogether/hyperstructure-client-js'
import { DepositButton, WithdrawButton } from '@shared/react-components'

interface AccountVaultButtonsProps {
  vault: Vault
}

export const AccountVaultButtons = (props: AccountVaultButtonsProps) => {
  const { vault } = props

  return (
    <div className='flex justify-end gap-2'>
      <WithdrawButton vault={vault} color='transparent' />
      <DepositButton vault={vault} />
    </div>
  )
}
