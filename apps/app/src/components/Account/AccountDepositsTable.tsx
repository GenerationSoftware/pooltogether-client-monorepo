import {
  useAllUserVaultBalances,
  useSelectedVaults,
  useSortedVaults
} from '@pooltogether/hyperstructure-react-hooks'
import { VaultBadge, WinChanceTooltip } from '@shared/react-components'
import { Table, TableProps } from '@shared/ui'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { AccountVaultBalance } from './AccountVaultBalance'
import { AccountVaultButtons } from './AccountVaultButtons'
import { AccountVaultOdds } from './AccountVaultOdds'

interface AccountDepositsTableProps extends Omit<TableProps, 'data' | 'keyPrefix'> {
  address?: Address
}

export const AccountDepositsTable = (props: AccountDepositsTableProps) => {
  const { address, className, ...rest } = props

  const router = useRouter()

  const t_vaults = useTranslations('Vaults')
  const t_vault = useTranslations('Vault')
  const t_tooltips = useTranslations('Tooltips')

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const { vaults } = useSelectedVaults()

  const { data: vaultBalances } = useAllUserVaultBalances(vaults, userAddress as Address)

  const { sortedVaults } = useSortedVaults(Object.values(vaults.vaults), {
    defaultSortId: 'userBalance'
  })

  const isExternalUser = useMemo(() => {
    return !!address && address.toLowerCase() !== _userAddress?.toLowerCase()
  }, [address, _userAddress])

  const tableHeaders = useMemo(() => {
    const headers: TableProps['data']['headers'] = {
      token: { content: t_vaults('headers.token') },
      odds: {
        content: isExternalUser ? (
          t_vault('headers.winChance')
        ) : (
          <span className='flex gap-1 items-center'>
            {t_vault('headers.yourWinChance')}
            <WinChanceTooltip intl={{ text: t_tooltips('winChance') }} className='text-xs' />
          </span>
        ),
        position: 'center'
      },
      balance: {
        content: isExternalUser ? t_vault('headers.balance') : t_vaults('headers.yourBalance'),
        position: 'center'
      }
    }
    if (!isExternalUser) {
      headers.manage = { content: <ManageHeader />, position: 'right' }
    }
    return headers
  }, [isExternalUser])

  const tableRows: TableProps['data']['rows'] = !!vaultBalances
    ? sortedVaults
        .map((vault) => {
          const shareBalance = vaultBalances[vault.id]?.amount ?? 0n
          if (!!vaultBalances[vault.id] && shareBalance > 0n && vault.decimals !== undefined) {
            const cells: TableProps['data']['rows'][0]['cells'] = {
              token: {
                content: (
                  <VaultBadge
                    vault={vault}
                    onClick={() => router.push(`/vault/${vault.chainId}/${vault.address}`)}
                  />
                )
              },
              odds: {
                content: <AccountVaultOdds vault={vault} address={userAddress} />,
                position: 'center'
              },
              balance: {
                content: <AccountVaultBalance vault={vault} address={userAddress} />,
                position: 'center'
              },
              manage: {
                content: <AccountVaultButtons vault={vault} />,
                position: 'right'
              }
            }
            return { id: vault.id, cells }
          } else {
            return { id: vault.id, cells: {} }
          }
        })
        .filter((row) => Object.keys(row.cells).length > 0)
    : []

  return (
    <Table
      data={{ headers: tableHeaders, rows: tableRows }}
      keyPrefix='accountVaultsTable'
      className={classNames('w-full', className)}
      {...rest}
    />
  )
}

const ManageHeader = () => {
  const t = useTranslations('Common')

  return <span className='w-[200px] text-center'>{t('manage')}</span>
}
