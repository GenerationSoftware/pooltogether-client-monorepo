import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { DepositButton, DeprecatedVaultTooltip, WithdrawButton } from '@shared/react-components'
import { useTranslations } from 'next-intl'

interface AccountVaultButtonsProps {
  vault: Vault
}

export const AccountVaultButtons = (props: AccountVaultButtonsProps) => {
  const { vault } = props

  const t_common = useTranslations('Common')
  const t_tooltips = useTranslations('Tooltips')

  const isDeprecated = vault.tags?.includes('deprecated')

  return (
    <div className='flex justify-end gap-2'>
      <WithdrawButton vault={vault} color='transparent'>
        {t_common('withdraw')}
      </WithdrawButton>

      {isDeprecated ? (
        <DeprecatedVaultTooltip intl={t_tooltips('deprecatedVault')}>
          <DepositButton vault={vault}>{t_common('deposit')}</DepositButton>
        </DeprecatedVaultTooltip>
      ) : (
        <DepositButton vault={vault}>{t_common('deposit')}</DepositButton>
      )}
    </div>
  )
}
