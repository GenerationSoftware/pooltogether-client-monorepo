import {
  useAllUserVaultBalances,
  useAllUserVaultDelegationBalances,
  useSelectedVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { VaultBadge, WinChanceTooltip } from '@shared/react-components'
import { Table, TableProps } from '@shared/ui'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useSortedVaultsByDelegatedAmount } from '@hooks/useSortedVaultsByDelegatedAmount'
import { AccountVaultDelegationAmount } from './AccountVaultDelegationAmount'
import { AccountVaultDelegationOdds } from './AccountVaultDelegationOdds'

interface AccountDelegationsTableProps extends Omit<TableProps, 'data' | 'keyPrefix'> {
  address?: Address
}

export const AccountDelegationsTable = (props: AccountDelegationsTableProps) => {
  const { address, className, innerClassName, headerClassName, rowClassName, ...rest } = props

  const t_vaults = useTranslations('Vaults')
  const t_vault = useTranslations('Vault')
  const t_tooltips = useTranslations('Tooltips')

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const { vaults } = useSelectedVaults()

  const { data: shareBalances } = useAllUserVaultBalances(vaults, userAddress as Address)

  const { data: delegationBalances } = useAllUserVaultDelegationBalances(
    vaults,
    userAddress as Address
  )

  const { data: sortedVaults } = useSortedVaultsByDelegatedAmount(
    Object.values(vaults.vaults),
    userAddress as Address
  )

  const isExternalUser = useMemo(() => {
    return !!address && address.toLowerCase() !== _userAddress?.toLowerCase()
  }, [address, _userAddress])

  const tableHeaders = useMemo(() => {
    const headers: TableProps['data']['headers'] = {
      token: { content: t_vaults('headers.prizeVault') },
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
      amount: { content: t_vault('headers.delegatedAmount'), position: 'center' }
    }
    if (!isExternalUser) {
      headers.null = { content: '' }
    }
    return headers
  }, [isExternalUser])

  const tableRows: TableProps['data']['rows'] =
    !!shareBalances && !!delegationBalances
      ? sortedVaults
          .map((vault) => {
            const delegationBalance =
              (delegationBalances[vault.id] ?? 0n) - (shareBalances[vault.id]?.amount ?? 0n)
            if (delegationBalance > 0n && vault.decimals !== undefined) {
              const cells: TableProps['data']['rows'][0]['cells'] = {
                token: {
                  content: (
                    <Link href={`/vault/${vault.chainId}/${vault.address}`}>
                      <VaultBadge vault={vault} onClick={() => {}} />
                    </Link>
                  )
                },
                odds: {
                  content: <AccountVaultDelegationOdds vault={vault} address={userAddress} />,
                  position: 'center'
                },
                amount: {
                  content: <AccountVaultDelegationAmount vault={vault} address={userAddress} />,
                  position: 'center'
                },
                null: { content: '' }
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
      keyPrefix='accountDelegationsTable'
      className={classNames('w-full rounded-t-2xl rounded-b-[2.5rem]', className)}
      innerClassName={classNames('!gap-3', innerClassName)}
      headerClassName={classNames('px-4', headerClassName)}
      rowClassName={classNames('!px-4 py-4 rounded-3xl', rowClassName)}
      {...rest}
    />
  )
}
