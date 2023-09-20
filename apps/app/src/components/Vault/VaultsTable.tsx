import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  SortDirection,
  SortId,
  useSortedVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { PrizePowerTooltip, SortIcon, VaultBadge } from '@shared/react-components'
import { Spinner, Table, TableProps } from '@shared/ui'
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
    rows: sortedVaults.map((vault) => ({
      id: vault.id,
      cells: {
        token: {
          content: (
            <Link href={`/vault/${vault.chainId}/${vault.address}`}>
              <VaultBadge vault={vault} onClick={() => {}} className='max-w-full' />
            </Link>
          ),
          className: 'pr-0'
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
    }))
  }

  return (
    <Table
      data={tableData}
      keyPrefix='vaultsTable'
      rounded={true}
      className={classNames('w-full', className)}
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
