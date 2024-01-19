import { useScreenSize } from '@shared/generic-react-hooks'
import { TokenValueAndAmount } from '@shared/react-components'
import { TokenWithAmount } from '@shared/types'
import { Button, ExternalLink, Table, TableData } from '@shared/ui'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { Address } from 'viem'
import { TokenBadge } from '@components/TokenBadge'
import { SupportedNetwork, V3_POOLS } from '@constants/config'
import { useUserV3Balances, V3BalanceToMigrate } from '@hooks/useUserV3Balances'
import { WithdrawPodButton } from './WithdrawPodButton'
import { WithdrawPoolButton } from './WithdrawPoolButton'

export interface V3MigrationsTableProps {
  userAddress: Address
  showPooly?: boolean
  className?: string
}

export const V3MigrationsTable = (props: V3MigrationsTableProps) => {
  const { userAddress, showPooly, className } = props

  const { data: userV3Balances } = useUserV3Balances(userAddress)

  const { isMobile } = useScreenSize()

  const tableData: TableData = {
    headers: {
      token: { content: 'Token' },
      status: { content: 'Status', position: 'center' },
      rewards: { content: 'Unclaimed Rewards', position: 'center' },
      balance: { content: 'Your Balance', position: 'center' },
      manage: { content: 'Manage', position: 'right' }
    },
    rows: userV3Balances.map((migration) => ({
      id: `v3Migration-${migration.token.chainId}-${migration.contractAddress}`,
      cells: {
        token: { content: <TokenBadge token={migration.token} /> },
        status: {
          content: <StatusItem />,
          position: 'center'
        },
        rewards: {
          content: <RewardsItem />,
          position: 'center'
        },
        balance: { content: <BalanceItem token={migration.token} />, position: 'center' },
        manage: { content: <ManageItem migration={migration} />, position: 'right' }
      }
    }))
  }

  if (isMobile) {
    return (
      <div className='w-full flex flex-col gap-4 items-center'>
        {userV3Balances.map((migration) => (
          <V3MigrationCard
            key={`v3Migration-${migration.token.chainId}-${migration.contractAddress}`}
            migration={migration}
          />
        ))}
      </div>
    )
  }

  return (
    <div className='relative w-full'>
      <Table
        keyPrefix='v3Migrations'
        data={tableData}
        className={classNames('w-full rounded-t-2xl rounded-b-[2.5rem]', className)}
        innerClassName='!gap-3'
        headerClassName='px-4'
        rowClassName='!px-4 py-4 rounded-3xl'
      />
      {showPooly && (
        <Image
          src='/pooly.svg'
          alt='Pooly'
          height={64}
          width={72}
          className='absolute -top-16 right-16 h-16 w-auto'
        />
      )}
    </div>
  )
}

interface V3MigrationCardProps {
  migration: V3BalanceToMigrate
  className?: string
}

const V3MigrationCard = (props: V3MigrationCardProps) => {
  const { migration, className } = props

  // TODO: mobile card

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
  className?: string
}

const RewardsItem = (props: RewardsItemProps) => {
  const { className } = props

  return (
    <ExternalLink
      href={'https://tools.pooltogether.com/token-faucet'}
      size='sm'
      className={classNames('text-pt-purple-400', className)}
    >
      Check
    </ExternalLink>
  )
}

interface BalanceItemProps {
  token: TokenWithAmount
  className?: string
}

const BalanceItem = (props: BalanceItemProps) => {
  const { token, className } = props

  const underlyingTokenAddress = V3_POOLS[token.chainId as SupportedNetwork]?.find(
    (pool) => pool.ticketAddress === token.address.toLowerCase()
  )?.tokenAddress

  return (
    <TokenValueAndAmount
      token={{ ...token, address: underlyingTokenAddress ?? token.address }}
      className={className}
    />
  )
}

interface ManageItemProps {
  migration: V3BalanceToMigrate
  className?: string
}

const ManageItem = (props: ManageItemProps) => {
  const { migration, className } = props

  const migrationURL = `/migrate/v3/${migration.token.chainId}/${migration.token.address}`

  return (
    <div className={classNames('flex gap-2 items-center', className)}>
      {migration.type === 'pool' && (
        <WithdrawPoolButton
          migration={migration}
          hideWrongNetworkState={true}
          color='transparent'
          className='min-w-[6rem]'
        />
      )}
      {migration.type === 'pod' && (
        <WithdrawPodButton
          migration={migration}
          hideWrongNetworkState={true}
          color='transparent'
          className='min-w-[6rem]'
        />
      )}
      <Link href={migrationURL} passHref={true}>
        <Button>Migrate</Button>
      </Link>
    </div>
  )
}
