import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useAllUserVaultBalances,
  useSelectedVaultLists,
  useSelectedVaults,
  useSortedVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { ImportedVaultTooltip, VaultBadge, WinChanceTooltip } from '@shared/react-components'
import { Table, TableProps } from '@shared/ui'
import { getVaultId } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { VaultButtons } from '@components/Vault/VaultButtons'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'
import { AccountVaultBalance } from './AccountVaultBalance'
import { AccountVaultOdds } from './AccountVaultOdds'

interface AccountDepositsTableProps extends Omit<TableProps, 'data' | 'keyPrefix'> {
  address?: Address
}

export const AccountDepositsTable = (props: AccountDepositsTableProps) => {
  const { address, className, innerClassName, headerClassName, rowClassName, ...rest } = props

  const t_vaults = useTranslations('Vaults')
  const t_vault = useTranslations('Vault')
  const t_tooltips = useTranslations('Tooltips')

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const { vaults } = useSelectedVaults()
  const { localVaultLists, importedVaultLists } = useSelectedVaultLists()

  const { data: vaultBalances } = useAllUserVaultBalances(vaults, userAddress as Address)

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const { sortedVaults } = useSortedVaults(vaults, {
    prizePools: prizePoolsArray,
    defaultSortId: 'userBalance'
  })

  const getImportedVaultSrcs = (vault: Vault) => {
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
  }

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
          const importedSrcs = getImportedVaultSrcs(vault)

          if (!!vaultBalances[vault.id] && shareBalance > 0n && vault.decimals !== undefined) {
            const cells: TableProps['data']['rows'][0]['cells'] = {
              token: {
                content: (
                  <>
                    <Link href={`/vault/${vault.chainId}/${vault.address}`}>
                      <VaultBadge vault={vault} onClick={() => {}} />
                    </Link>
                    {importedSrcs.length > 0 && (
                      <ImportedVaultTooltip
                        vaultLists={importedSrcs}
                        intl={t_tooltips('importedVault')}
                      />
                    )}
                  </>
                ),
                className: 'gap-2'
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
                content: <VaultButtons vault={vault} />,
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
      className={classNames('w-full rounded-t-2xl rounded-b-[2.5rem]', className)}
      innerClassName={classNames('!gap-3', innerClassName)}
      headerClassName={classNames('px-4', headerClassName)}
      rowClassName={classNames('!px-4 py-4 rounded-3xl', rowClassName)}
      {...rest}
    />
  )
}

const ManageHeader = () => {
  const t = useTranslations('Common')

  return <span className='w-24 text-center'>{t('manage')}</span>
}
