import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { VaultBadge, WinChanceTooltip } from '@shared/react-components'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { AccountVaultDelegationAmount } from './AccountVaultDelegationAmount'
import { AccountVaultDelegationOdds } from './AccountVaultDelegationOdds'

interface AccountDelegationsCardProps {
  vault: Vault
  address?: Address
}

export const AccountDelegationsCard = (props: AccountDelegationsCardProps) => {
  const { vault, address } = props

  const t_vault = useTranslations('Vault')
  const t_tooltips = useTranslations('Tooltips')

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const isExternalUser = useMemo(() => {
    return !!address && address.toLowerCase() !== _userAddress?.toLowerCase()
  }, [address, _userAddress])

  return (
    <div className='flex flex-col gap-4 bg-pt-transparent rounded-lg px-3 pt-3 pb-6'>
      <span>
        <Link href={`/vault/${vault.chainId}/${vault.address}`}>
          <VaultBadge vault={vault} onClick={() => {}} />
        </Link>
      </span>
      <div className='w-full flex flex-col gap-1 px-3'>
        <div className='flex items-center justify-between'>
          <span className='text-sm text-pt-purple-200'>{t_vault('headers.delegatedAmount')}</span>
          <AccountVaultDelegationAmount
            vault={vault}
            address={userAddress}
            className='!flex-row gap-1'
          />
        </div>
        <div className='flex items-center justify-between'>
          <span className='flex gap-1 items-center text-sm text-pt-purple-200'>
            {isExternalUser ? t_vault('headers.winChance') : t_vault('headers.yourWinChance')}
            <WinChanceTooltip intl={{ text: t_tooltips('winChance') }} className='text-xs' />
          </span>
          <span className='text-sm'>
            <AccountVaultDelegationOdds vault={vault} address={userAddress} />
          </span>
        </div>
      </div>
    </div>
  )
}
