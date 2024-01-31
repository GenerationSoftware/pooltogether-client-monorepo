import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { GiftIcon } from '@heroicons/react/24/solid'
import {
  DelegateButton,
  DepositButton,
  DeprecatedVaultTooltip,
  WithdrawButton
} from '@shared/react-components'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

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
      <DelegateButton vault={vault} color='transparent'>
        <GiftIcon className='w-4 h-4 my-0.5 block' />
      </DelegateButton>
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
