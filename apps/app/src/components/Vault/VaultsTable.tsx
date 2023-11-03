import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  SortDirection,
  SortId,
  useSelectedVaultLists,
  useSortedVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import {
  ImportedVaultTooltip,
  PrizePowerTooltip,
  SortIcon,
  VaultBadge
} from '@shared/react-components'
import { Spinner, Table, TableProps } from '@shared/ui'
import { getVaultId } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ReactNode } from 'react'
import { AccountVaultBalance } from '@components/Account/AccountVaultBalance'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'
import { VaultButtons } from './VaultButtons'
import { VaultPrizePower } from './VaultPrizePower'
import { VaultTotalDeposits } from './VaultTotalDeposits'

interface VaultsTableProps {
  chainId: number
  vaults: Vault[]
  className?: string
}

export const VaultsTable = (props: VaultsTableProps) => {
  const { chainId, vaults, className } = props

  const t_common = useTranslations('Common')
  const t_vaults = useTranslations('Vaults')
  const t_tooltips = useTranslations('Tooltips')

  const prizePools = useSupportedPrizePools()
  const prizePool = Object.values(prizePools).find((prizePool) => prizePool.chainId === chainId)

  const {
    sortedVaults,
    sortVaultsBy,
    setSortVaultsBy,
    sortDirection,
    setSortDirection,
    toggleSortDirection,
    isFetched
  } = useSortedVaults(vaults, { prizePool })

  const { localVaultLists, importedVaultLists } = useSelectedVaultLists()

  const handleHeaderClick = (id: SortId) => {
    if (sortVaultsBy === id) {
      toggleSortDirection()
    } else {
      setSortDirection('desc')
      setSortVaultsBy(id)
    }
  }

  const getDirection = (id: SortId) => {
    if (sortVaultsBy === id) {
      return sortDirection
    }
  }

  if (!isFetched) {
    return <Spinner className={className} />
  }

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

  const tableData: TableProps['data'] = {
    headers: {
      token: { content: t_vaults('headers.token') },
      prizePower: {
        content: (
          <SortableHeader
            id='prizePower'
            onClick={handleHeaderClick}
            direction={getDirection('prizePower')}
            append={
              <PrizePowerTooltip
                iconSize='lg'
                intl={{ text: t_tooltips('prizePower'), learnMore: t_common('learnMore') }}
              />
            }
          />
        ),
        position: 'center'
      },
      totalDeposits: {
        content: (
          <SortableHeader
            id='totalBalance'
            onClick={handleHeaderClick}
            direction={getDirection('totalBalance')}
          />
        ),
        position: 'center'
      },
      balance: {
        content: (
          <SortableHeader
            id='userBalance'
            onClick={handleHeaderClick}
            direction={getDirection('userBalance')}
          />
        ),
        position: 'center'
      },
      manage: { content: <ManageHeader />, position: 'right' }
    },
    rows: sortedVaults.map((vault) => {
      const importedSrcs = getImportedVaultSrcs(vault)

      return {
        id: vault.id,
        cells: {
          token: {
            content: (
              <>
                <Link href={`/vault/${vault.chainId}/${vault.address}`}>
                  <VaultBadge vault={vault} onClick={() => {}} className='max-w-full' />
                </Link>
                {importedSrcs.length > 0 && (
                  <ImportedVaultTooltip
                    vaultLists={importedSrcs}
                    intl={t_tooltips('importedVault')}
                  />
                )}
              </>
            ),
            className: 'gap-2 pr-0'
          },
          prizePower: {
            content: (
              <span className='text-xl font-semibold text-pt-purple-400'>
                <VaultPrizePower vault={vault} />
              </span>
            ),
            position: 'center'
          },
          totalDeposits: {
            content: <VaultTotalDeposits vault={vault} />,
            position: 'center'
          },
          balance: {
            content: <AccountVaultBalance vault={vault} />,
            position: 'center'
          },
          manage: { content: <VaultButtons vault={vault} inverseOrder={true} />, position: 'right' }
        }
      }
    })
  }

  return (
    <Table
      data={tableData}
      keyPrefix='vaultsTable'
      className={classNames('w-full rounded-t-2xl rounded-b-[2.5rem]', className)}
      innerClassName='!gap-3'
      headerClassName='px-4'
      rowClassName='!px-4 py-4 rounded-3xl'
      gridColsClassName='grid-cols-[minmax(0,6fr)_repeat(3,minmax(0,4fr))_minmax(0,5fr)]'
    />
  )
}

interface SortableHeaderProps {
  id: SortId
  onClick: (id: SortId) => void
  direction?: SortDirection
  append?: ReactNode
}

const SortableHeader = (props: SortableHeaderProps) => {
  const { id, onClick, direction, append } = props

  const t = useTranslations('Vaults')

  const names: Record<SortId, string> = {
    prizePower: t('headers.prizePower'),
    totalBalance: t('headers.totalDeposits'),
    userBalance: t('headers.yourBalance')
  }

  return (
    <div className='flex gap-1 items-center'>
      <div
        onClick={() => onClick(id)}
        className='flex gap-1 items-center cursor-pointer select-none'
      >
        <SortIcon direction={direction} className='w-4 h-auto shrink-0' />
        {names[id]}
      </div>
      {append}
    </div>
  )
}

const ManageHeader = () => {
  const t = useTranslations('Common')

  return <span className='mr-[18px]'>{t('manage')}</span>
}
