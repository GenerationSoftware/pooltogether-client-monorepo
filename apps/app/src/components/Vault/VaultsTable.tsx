import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  SortDirection,
  SortId,
  useSelectedVaultLists,
  useSortedVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import {
  ImportedVaultTooltip,
  PrizesTooltip,
  RelativeWinChanceTooltip,
  SortIcon,
  VaultBadge
} from '@shared/react-components'
import { Spinner, Table, TableProps } from '@shared/ui'
import { getVaultId } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ReactNode } from 'react'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'
import { VaultBonusRewards } from './VaultBonusRewards'
import { VaultButtons } from './VaultButtons'
import { VaultPrizes } from './VaultPrizes'
import { VaultTotalDeposits } from './VaultTotalDeposits'
import { VaultWinChance } from './VaultWinChance'

interface VaultsTableProps {
  vaults: Vault[]
  className?: string
}

export const VaultsTable = (props: VaultsTableProps) => {
  const { vaults, className } = props

  const t_common = useTranslations('Common')
  const t_vaults = useTranslations('Vaults')
  const t_tooltips = useTranslations('Tooltips')

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const {
    sortedVaults,
    sortVaultsBy,
    setSortVaultsBy,
    sortDirection,
    setSortDirection,
    toggleSortDirection,
    isFetched
  } = useSortedVaults(vaults, { prizePools: prizePoolsArray })

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
      vault: { content: t_vaults('headers.prizeVault') },
      prizes: {
        content: (
          <SortableHeader
            id='prizes'
            onClick={handleHeaderClick}
            direction={getDirection('prizes')}
            append={<PrizesTooltip iconSize='lg' intl={t_tooltips('prizes')} />}
          />
        ),
        position: 'center'
      },
      winChance: {
        content: (
          <SortableHeader
            id='winChance'
            onClick={handleHeaderClick}
            direction={getDirection('winChance')}
            append={
              <RelativeWinChanceTooltip iconSize='lg' intl={t_tooltips('relativeWinChance')} />
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
      manage: { content: <ManageHeader />, position: 'right' }
    },
    rows: sortedVaults.map((vault) => {
      const importedSrcs = getImportedVaultSrcs(vault)

      return {
        id: vault.id,
        cells: {
          vault: {
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
          prizes: {
            content: (
              <>
                <VaultPrizes vault={vault} />
                {/* TODO: append tokens that rewards are in */}
                <VaultBonusRewards
                  vault={vault}
                  prepend='+'
                  append={<span className='text-pt-purple-200'>{t_common('apr')}</span>}
                  hideUnlessPresent={true}
                  className='text-sm'
                />
              </>
            ),
            position: 'center',
            className: 'flex-col text-center'
          },
          winChance: {
            content: <VaultWinChance vault={vault} className='w-14' />,
            position: 'center'
          },
          totalDeposits: {
            content: <VaultTotalDeposits vault={vault} className='text-center' />,
            position: 'center'
          },
          manage: {
            content: <VaultButtons vault={vault} forceHide={['delegate']} />,
            position: 'right'
          }
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
      gridColsClassName='grid-cols-[minmax(0,5fr)_repeat(3,minmax(0,4fr))_minmax(0,5fr)]'
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
    prizes: t('headers.prizes'),
    winChance: t('headers.winChance'),
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

  return <span className='w-24 text-center'>{t('manage')}</span>
}
