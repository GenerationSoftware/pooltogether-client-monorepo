import { useScreenSize } from '@shared/generic-react-hooks'
import { TokenValueAndAmount } from '@shared/react-components'
import { TokenWithAmount } from '@shared/types'
import { Button, Spinner, Table, TableData } from '@shared/ui'
import { formatBigIntForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { Address } from 'viem'
import { TokenBadge } from '@components/TokenBadge'
import { V4_POOLS, V4_PROMOTIONS } from '@constants/config'
import { useUserV4Balances, V4BalanceToMigrate } from '@hooks/useUserV4Balances'
import { useUserV4ClaimableRewards } from '@hooks/useUserV4ClaimableRewards'
import { WithdrawButton } from './WithdrawButton'

export interface V4MigrationsTableProps {
  userAddress: Address
  showPooly?: boolean
  className?: string
}

export const V4MigrationsTable = (props: V4MigrationsTableProps) => {
  const { userAddress, showPooly, className } = props

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
        manage: {
          content: <ManageItem userAddress={userAddress} migration={migration} />,
          position: 'right'
        }
      }
    }))
  }

  if (isMobile) {
    return (
      <div className='w-full flex flex-col gap-4 items-center'>
        {userV4Balances.map((migration) => (
          <V4MigrationCard
            key={`v4Migration-${migration.token.chainId}-${migration.contractAddress}`}
            migration={migration}
          />
        ))}
      </div>
    )
  }

  return (
    <div className='relative w-full'>
      <Table
        keyPrefix='v4Migrations'
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

interface V4MigrationCardProps {
  migration: V4BalanceToMigrate
  className?: string
}

const V4MigrationCard = (props: V4MigrationCardProps) => {
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
  chainId: number
  userAddress: Address
  className?: string
}

const RewardsItem = (props: RewardsItemProps) => {
  const { chainId, userAddress, className } = props

  const { data: claimable, isFetched: isFetchedClaimable } = useUserV4ClaimableRewards(
    chainId,
    userAddress
  )

  if (!isFetchedClaimable && !!V4_PROMOTIONS[chainId]) {
    return <Spinner />
  }

  return (
    <div className={className}>
      {!!claimable?.total ? (
        <span className='flex gap-1 items-center'>
          <span className='text-xl font-medium text-pt-purple-100'>
            {formatBigIntForDisplay(claimable.total, claimable.token.decimals)}
          </span>
          <span className='text-sm text-pt-purple-400'>{claimable.token.symbol}</span>
        </span>
      ) : (
        <>-</>
      )}
    </div>
  )
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
  userAddress: Address
  migration: V4BalanceToMigrate
  className?: string
}

const ManageItem = (props: ManageItemProps) => {
  const { userAddress, migration, className } = props

  const { refetch: refetchUserV4Balances } = useUserV4Balances(userAddress)

  const migrationURL = `/migrate/v4/${migration.token.chainId}/${migration.token.address}`

  return (
    <div className={classNames('flex gap-2 items-center', className)}>
      <WithdrawButton
        migration={migration}
        txOptions={{ onSuccess: refetchUserV4Balances }}
        hideWrongNetworkState={true}
        color='transparent'
        className='min-w-[6rem]'
      />
      <Link href={migrationURL} passHref={true}>
        <Button>Migrate</Button>
      </Link>
    </div>
  )
}
