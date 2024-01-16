import { useScreenSize } from '@shared/generic-react-hooks'
import { TokenIcon, TokenValueAndAmount } from '@shared/react-components'
import { TokenWithAmount } from '@shared/types'
import { Table, TableData } from '@shared/ui'
import { NETWORK, POOL_TOKEN_ADDRESSES } from '@shared/utilities'
import classNames from 'classnames'
import { Address } from 'viem'
import { SimpleBadge } from '@components/SimpleBadge'
import { TokenBadge } from '@components/TokenBadge'
import { V4_POOLS } from '@constants/config'
import { useUserV4Balances, V4BalanceToMigrate } from '@hooks/useUserV4Balances'
import { WithdrawButton } from './WithdrawButton'

export interface V4MigrationsProps {
  userAddress: Address
  className?: string
}

export const V4Migrations = (props: V4MigrationsProps) => {
  const { userAddress, className } = props

  const { data: userV4Balances } = useUserV4Balances(userAddress)

  const { isMobile } = useScreenSize()

  const tableData: TableData = {
    headers: {
      token: { content: 'Token' },
      status: { content: 'Status', position: 'center' },
      rewards: { content: 'Unclaimed Rewards', position: 'center' },
      balance: { content: 'Your Balance', position: 'center' },
      manage: { content: 'Manage', position: 'right' }
    },
    rows: userV4Balances.map((migration) => ({
      id: `v4Migration-${migration.token.chainId}-${migration.contractAddress}`,
      cells: {
        token: { content: <TokenBadge token={migration.token} /> },
        status: {
          content: <StatusItem />,
          position: 'center'
        },
        rewards: {
          content: <RewardsItem chainId={migration.token.chainId} userAddress={userAddress} />,
          position: 'center'
        },
        balance: { content: <BalanceItem token={migration.token} />, position: 'center' },
        manage: { content: <ManageItem migration={migration} />, position: 'right' }
      }
    }))
  }

  return (
    <section className={classNames('w-full flex flex-col gap-6 items-center', className)}>
      <SimpleBadge>
        <TokenIcon
          token={{ chainId: NETWORK.mainnet, address: POOL_TOKEN_ADDRESSES[NETWORK.mainnet] }}
        />
        V4 Pools
      </SimpleBadge>
      {isMobile ? (
        <div className='w-full flex flex-col gap-4 items-center'>
          {userV4Balances.map((migration) => (
            <V4MigrationCard
              key={`v4Migration-${migration.token.chainId}-${migration.contractAddress}`}
              migration={migration}
            />
          ))}
        </div>
      ) : (
        <Table
          keyPrefix='v4Migrations'
          data={tableData}
          className={classNames('w-full rounded-t-2xl rounded-b-[2.5rem]', className)}
          innerClassName='!gap-3'
          headerClassName='px-4'
          rowClassName='!px-4 py-4 rounded-3xl'
        />
      )}
    </section>
  )
}

interface V4MigrationCardProps {
  migration: V4BalanceToMigrate
  className?: string
}

const V4MigrationCard = (props: V4MigrationCardProps) => {
  const { migration, className } = props

  // TODO

  return <></>
}

interface StatusItemProps {
  className?: string
}

const StatusItem = (props: StatusItemProps) => {
  const { className } = props

  return <span className={classNames('text-pt-purple-100', className)}>Deprecated</span>
}

interface RewardsItemProps {
  chainId: number
  userAddress: Address
  className?: string
}

const RewardsItem = (props: RewardsItemProps) => {
  const { chainId, userAddress, className } = props

  // TODO: display unclaimed OP rewards if item is on OP, if any

  return <>-</>
}

interface BalanceItemProps {
  token: TokenWithAmount
  className?: string
}

const BalanceItem = (props: BalanceItemProps) => {
  const { token, className } = props

  const underlyingTokenAddress = V4_POOLS[token.chainId]?.underlyingTokenAddress

  return (
    <TokenValueAndAmount
      token={{ ...token, address: underlyingTokenAddress ?? token.address }}
      className={className}
    />
  )
}

interface ManageItemProps {
  migration: V4BalanceToMigrate
  className?: string
}

const ManageItem = (props: ManageItemProps) => {
  const { migration, className } = props

  return (
    <div className={classNames('', className)}>
      <WithdrawButton migration={migration} color='transparent' className='min-w-[6rem]' />
      {/* TODO: add migrate button */}
    </div>
  )
}
