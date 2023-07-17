import { Vault } from '@pooltogether/hyperstructure-client-js'
import { VaultBadge, WinChanceTooltip } from '@shared/react-components'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import { AccountVaultBalance } from '@components/Account/AccountVaultBalance'
import { VaultButtons } from '@components/Vault/VaultButtons'
import { AccountVaultOdds } from './AccountVaultOdds'

interface AccountVaultCardProps {
  vault: Vault
}

export const AccountVaultCard = (props: AccountVaultCardProps) => {
  const { vault } = props

  const router = useRouter()

  const t_vault = useTranslations('Vault')
  const t_tooltips = useTranslations('Tooltips')

  return (
    <div className='flex flex-col gap-4 bg-pt-transparent rounded-lg px-3 pt-3 pb-6'>
      <span>
        <VaultBadge
          vault={vault}
          onClick={() => router.push(`/vault/${vault.chainId}/${vault.address}`)}
        />
      </span>
      <div className='w-full flex flex-col gap-1 px-3'>
        <div className='flex items-center justify-between'>
          <span className='text-xs text-pt-purple-200'>{t_vault('headers.myBalance')}</span>
          <AccountVaultBalance vault={vault} className='!flex-row gap-1' />
        </div>
        <div className='flex items-center justify-between'>
          <span className='flex gap-1 items-center text-xs text-pt-purple-200'>
            {t_vault('headers.myWinChance')}{' '}
            <WinChanceTooltip intl={{ text: t_tooltips('winChance') }} className='text-xs' />
          </span>
          <span className='text-sm'>
            <AccountVaultOdds vault={vault} />
          </span>
        </div>
      </div>
      <VaultButtons vault={vault} fullSized={true} className='w-full justify-center' />
    </div>
  )
}
