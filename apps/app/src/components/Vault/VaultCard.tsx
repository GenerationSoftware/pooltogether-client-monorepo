import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useUserVaultTokenBalance } from '@generationsoftware/hyperstructure-react-hooks'
import { ImportedVaultTooltip, PrizeYieldTooltip, VaultBadge } from '@shared/react-components'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { AccountVaultBalance } from '@components/Account/AccountVaultBalance'
import { useVaultImportedListSrcs } from '@hooks/useVaultImportedListSrcs'
import { VaultBonusRewards } from './VaultBonusRewards'
import { VaultButtons } from './VaultButtons'
import { VaultPrizeYield } from './VaultPrizeYield'
import { VaultTotalDeposits } from './VaultTotalDeposits'

interface VaultCardProps {
  vault: Vault
  address?: Address
}

export const VaultCard = (props: VaultCardProps) => {
  const { vault, address } = props

  const t_common = useTranslations('Common')
  const t_vaults = useTranslations('Vaults')
  const t_tooltips = useTranslations('Tooltips')

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const { data: tokenBalance } = useUserVaultTokenBalance(vault, userAddress as Address)

  const importedSrcs = useVaultImportedListSrcs(vault)

  return (
    <div className='flex flex-col gap-4 bg-pt-transparent rounded-lg px-3 pt-3 pb-6'>
      <div className='inline-flex gap-2 items-center'>
        <Link href={`/vault/${vault.chainId}/${vault.address}`}>
          <VaultBadge vault={vault} onClick={() => {}} />
        </Link>
        {importedSrcs.length > 0 && (
          <ImportedVaultTooltip vaultLists={importedSrcs} intl={t_tooltips('importedVault')} />
        )}
      </div>
      <div className='w-full flex flex-col gap-1 px-3'>
        {!!tokenBalance && tokenBalance.amount > 0n && (
          <div className='flex items-center justify-between'>
            <span className='text-xs text-pt-purple-200'>{t_vaults('headers.yourBalance')}</span>
            <AccountVaultBalance vault={vault} className='!flex-row gap-1' />
          </div>
        )}
        <div className='flex items-center justify-between'>
          <span className='flex gap-1 items-center text-xs text-pt-purple-200'>
            {t_vaults('headers.prizeYield')}
            <PrizeYieldTooltip
              intl={{ text: t_tooltips('prizeYield'), learnMore: t_common('learnMore') }}
              className='text-xs'
            />
          </span>
          <VaultPrizeYield
            vault={vault}
            label={t_common('apr')}
            valueClassName='text-sm'
            labelClassName='text-xs text-pt-purple-200'
          />
          <VaultBonusRewards
            vault={vault}
            label={t_common('apr')}
            valueClassName='text-sm'
            labelClassName='text-xs text-pt-purple-200'
          />
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-xs text-pt-purple-200'>{t_vaults('headers.totalDeposits')}</span>
          <span className='text-sm'>
            <VaultTotalDeposits vault={vault} />
          </span>
        </div>
      </div>
      <VaultButtons vault={vault} fullSized={true} className='w-full justify-center' />
    </div>
  )
}
