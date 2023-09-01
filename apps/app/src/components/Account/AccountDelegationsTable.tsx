import {
  useAllUserVaultDelegationBalances,
  useSelectedVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { VaultBadge, WinChanceTooltip } from '@shared/react-components'
import { Table, TableProps } from '@shared/ui'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useSortedVaultsByDelegatedAmount } from '@hooks/useSortedVaultsByDelegatedAmount'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'
import { AccountVaultDelegationAmount } from './AccountVaultDelegationAmount'
import { AccountVaultDelegationOdds } from './AccountVaultDelegationOdds'

interface AccountDelegationsTableProps extends Omit<TableProps, 'data' | 'keyPrefix'> {
  address?: Address
}

export const AccountDelegationsTable = (props: AccountDelegationsTableProps) => {
  const { address, className, ...rest } = props

  const router = useRouter()

  const t_vaults = useTranslations('Vaults')
  const t_vault = useTranslations('Vault')
  const t_tooltips = useTranslations('Tooltips')

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const { vaults } = useSelectedVaults()

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const { data: delegationBalances } = useAllUserVaultDelegationBalances(
    prizePoolsArray,
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
      amount: { content: t_vault('headers.delegatedAmount'), position: 'center' }
    }
    if (!isExternalUser) {
      headers.null = { content: '' }
    }
    return headers
  }, [isExternalUser])

  const tableRows: TableProps['data']['rows'] = !!delegationBalances
    ? sortedVaults
        .map((vault) => {
          const delegationBalance =
            delegationBalances[vault.chainId]?.[vault.address.toLowerCase() as Address] ?? 0n
          if (delegationBalance > 0n && vault.decimals !== undefined) {
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
      className={classNames('w-full', className)}
      {...rest}
    />
  )
}
