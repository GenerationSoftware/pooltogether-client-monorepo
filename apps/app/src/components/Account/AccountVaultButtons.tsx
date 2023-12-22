import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { WithdrawButton } from '@shared/react-components'
import { useTranslations } from 'next-intl'
import { DepositButtonWithDeprecated } from '../DepositButtonWithDeprecated'

interface AccountVaultButtonsProps {
  vault: Vault
}

export const AccountVaultButtons = (props: AccountVaultButtonsProps) => {
  const { vault } = props

  const t = useTranslations('Common')

  const vaultDeprecated = vault.tags?.includes('deprecated')

  return (
    <div className='flex justify-end gap-2'>
      <WithdrawButton vault={vault} color='transparent'>
        {t('withdraw')}
      </WithdrawButton>

      <DepositButtonWithDeprecated
        vault={vault}
        fullSized={true}
        inverseOrder={true}
        vaultDeprecated={vaultDeprecated}
      />
    </div>
  )
}
