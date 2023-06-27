import { Vault } from '@pooltogether/hyperstructure-client-js'
import { SortDirection, SortId, useSortedVaults } from '@pooltogether/hyperstructure-react-hooks'
import { PrizePowerTooltip, SortIcon, VaultBadge } from '@shared/react-components'
import { Spinner, Table, TableProps } from '@shared/ui'
import classNames from 'classnames'
import { useRouter } from 'next/router'
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

  const router = useRouter()

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
      token: { content: 'Token' },
      prizePower: {
        content: (
          <SortableHeader
            id='prizePower'
            onClick={handleHeaderClick}
            direction={getDirection('prizePower')}
            append={<PrizePowerTooltip iconSize='lg' />}
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
            <VaultBadge
              vault={vault}
              onClick={() => router.push(`/vault/${vault.id}`)}
              className='max-w-full'
            />
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

  const names: Record<SortId, string> = {
    prizePower: 'Prize Power',
    totalBalance: 'Total Deposits',
    userBalance: 'My Balance'
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
  return <span className='mr-[18px]'>Manage</span>
}
