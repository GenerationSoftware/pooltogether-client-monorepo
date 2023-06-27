import {
  useAllUserVaultBalances,
  useSelectedVaults,
  useSortedVaults
} from '@pooltogether/hyperstructure-react-hooks'
import { VaultBadge } from '@shared/react-components'
import { Table, TableProps } from '@shared/ui'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { AccountVaultBalance } from './AccountVaultBalance'
import { AccountVaultButtons } from './AccountVaultButtons'
import { AccountVaultOdds } from './AccountVaultOdds'

interface AccountDepositsTableProps extends Omit<TableProps, 'data' | 'keyPrefix'> {}

export const AccountDepositsTable = (props: AccountDepositsTableProps) => {
  const { className, ...rest } = props

  const router = useRouter()

  const { address: userAddress } = useAccount()

  const { vaults } = useSelectedVaults()

  const { data: vaultBalances, isFetched: isFetchedVaultBalances } = useAllUserVaultBalances(
    vaults,
    userAddress as `0x${string}`
  )

  const { sortedVaults, isFetched } = useSortedVaults(Object.values(vaults.vaults), {
    defaultSortId: 'userBalance'
  })

  if (isFetched && isFetchedVaultBalances) {
    const tableData: TableProps['data'] = {
      headers: {
        token: { content: 'Token' },
        odds: { content: 'My Win Chance', position: 'center' },
        balance: { content: 'My Balance', position: 'center' },
        manage: { content: <ManageHeader />, position: 'right' }
      },
      rows: !!vaultBalances
        ? sortedVaults
            .map((vault) => {
              const shareBalance = vaultBalances[vault.id]?.amount ?? 0n
              if (!!vaultBalances[vault.id] && shareBalance > 0n && vault.decimals !== undefined) {
                const cells: TableProps['data']['rows'][0]['cells'] = {
                  token: {
                    content: (
                      <VaultBadge vault={vault} onClick={() => router.push(`/vault/${vault.id}`)} />
                    )
                  },
                  odds: {
                    content: <AccountVaultOdds vault={vault} />,
                    position: 'center'
                  },
                  balance: {
                    content: <AccountVaultBalance vault={vault} />,
                    position: 'center'
                  },
                  manage: { content: <AccountVaultButtons vault={vault} />, position: 'right' }
                }
                return { id: vault.id, cells }
              } else {
                return { id: vault.id, cells: {} }
              }
            })
            .filter((row) => Object.keys(row.cells).length > 0)
        : []
    }

    return (
      <Table
        data={tableData}
        keyPrefix='accountVaultsTable'
        className={classNames('w-full', className)}
        {...rest}
      />
    )
  }

  return <></>
}

const ManageHeader = () => {
  return <span className='w-[200px] text-center'>Manage</span>
}
