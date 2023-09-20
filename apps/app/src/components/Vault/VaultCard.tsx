import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useSelectedVaultLists,
  useUserVaultTokenBalance
} from '@generationsoftware/hyperstructure-react-hooks'
import { ImportedVaultTooltip, PrizePowerTooltip, VaultBadge } from '@shared/react-components'
import { getVaultId } from '@shared/utilities'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { AccountVaultBalance } from '@components/Account/AccountVaultBalance'
import { VaultButtons } from './VaultButtons'
import { VaultPrizePower } from './VaultPrizePower'
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

  const { localVaultLists, importedVaultLists } = useSelectedVaultLists()

  const { data: tokenBalance } = useUserVaultTokenBalance(vault, userAddress as Address)

  const importedSrcs = useMemo(() => {
    const listsWithVault: { name: string; href: string }[] = []

    const isOnLocalVaultLists = Object.values(localVaultLists).some((list) => {
      for (const listVault of list.tokens) {
        if (vault.id === getVaultId(listVault)) {
          return true
        }
      }
    })

    if (!isOnLocalVaultLists) {
      Object.entries(importedVaultLists).forEach(([href, list]) => {
        for (const listVault of list.tokens) {
          if (vault.id === getVaultId(listVault)) {
            const name = list.name
            listsWithVault.push({ name, href })
            break
          }
        }
      })
    }

    return listsWithVault
  }, [vault, localVaultLists, importedVaultLists])

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
            {t_vaults('headers.prizePower')}
            <PrizePowerTooltip
              intl={{ text: t_tooltips('prizePower'), learnMore: t_common('learnMore') }}
              className='text-xs'
            />
          </span>
          <span className='text-sm'>
            <VaultPrizePower vault={vault} />
          </span>
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
