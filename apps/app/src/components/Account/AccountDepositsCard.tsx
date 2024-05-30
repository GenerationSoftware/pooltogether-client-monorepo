import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { ImportedVaultTooltip, VaultBadge, WinChanceTooltip } from '@shared/react-components'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { AccountVaultBalance } from '@components/Account/AccountVaultBalance'
import { VaultButtons } from '@components/Vault/VaultButtons'
import { useVaultImportedListSrcs } from '@hooks/useVaultImportedListSrcs'
import { AccountVaultOdds } from './AccountVaultOdds'

interface AccountDepositsCardProps {
  vault: Vault
  address?: Address
}

export const AccountDepositsCard = (props: AccountDepositsCardProps) => {
  const { vault, address } = props

  const t_vault = useTranslations('Vault')
  const t_tooltips = useTranslations('Tooltips')

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const importedSrcs = useVaultImportedListSrcs(vault)

  const isExternalUser = useMemo(() => {
    return !!address && address.toLowerCase() !== _userAddress?.toLowerCase()
  }, [address, _userAddress])

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
        <div className='flex items-center justify-between'>
          <span className='text-sm text-pt-purple-200'>
            {isExternalUser ? t_vault('headers.balance') : t_vault('headers.yourBalance')}
          </span>
          <AccountVaultBalance vault={vault} address={userAddress} className='!items-end' />
        </div>
        <div className='flex items-center justify-between'>
          <span className='flex gap-1 items-center text-sm text-pt-purple-200'>
            {isExternalUser ? t_vault('headers.winChance') : t_vault('headers.yourWinChance')}
            <WinChanceTooltip intl={{ text: t_tooltips('winChance') }} className='text-xs' />
          </span>
          <AccountVaultOdds vault={vault} address={userAddress} className='text-sm' />
        </div>
      </div>
      {!isExternalUser && (
        <VaultButtons vault={vault} fullSized={true} className='w-full justify-end' />
      )}
    </div>
  )
}
