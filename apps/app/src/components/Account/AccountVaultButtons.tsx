import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { DepositButton, WithdrawButton } from '@shared/react-components'
import { useTranslations } from 'next-intl'

interface AccountVaultButtonsProps {
  vault: Vault
}

export const AccountVaultButtons = (props: AccountVaultButtonsProps) => {
  const { vault } = props

  const t = useTranslations('Common')

  return (
    <div className='flex justify-end gap-2'>
      <WithdrawButton vault={vault} color='transparent'>
        {t('withdraw')}
      </WithdrawButton>
      <DepositButton vault={vault}>{t('deposit')}</DepositButton>
    </div>
  )
}
