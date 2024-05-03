import { useScreenSize } from '@shared/generic-react-hooks'
import { TokenValueAndAmount } from '@shared/react-components'
import { TokenWithAmount, TokenWithLogo } from '@shared/types'
import { Button, Spinner, Table, TableData } from '@shared/ui'
import { formatBigIntForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode, useMemo } from 'react'
import { Address } from 'viem'
import { TokenBadge } from '@components/TokenBadge'
import { V4_POOLS, V4_PROMOTIONS } from '@constants/config'
import { useUserV4Balances, V4BalanceToMigrate } from '@hooks/useUserV4Balances'
import {
  useAllUserV4ClaimableRewards,
  useUserV4ClaimableRewards
} from '@hooks/useUserV4ClaimableRewards'
import { ClaimRewardsButton } from './ClaimRewardsButton'
import { WithdrawButton } from './WithdrawButton'

export interface V4MigrationsTableProps {
  userAddress: Address
  showPooly?: boolean
  className?: string
}

export const V4MigrationsTable = (props: V4MigrationsTableProps) => {
  const { userAddress, showPooly, className } = props

  const { data: userV4Balances } = useUserV4Balances(userAddress)
  const { data: userV4Rewards } = useAllUserV4ClaimableRewards(userAddress)

  const { isMobile } = useScreenSize()

  const tableRows = useMemo(() => {
    const rows: TableData['rows'] = userV4Balances.map((migration) => ({
      id: `v4Migration-${migration.token.chainId}-${migration.contractAddress}`,
      cells: {
        token: { content: <TokenBadge token={migration.token} /> },
        status: { content: <StatusItem />, position: 'center' },
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

    userV4Rewards.forEach((entry) => {
      const foundNetworkEntry = userV4Balances.find((e) => e.token.chainId === entry.token.chainId)

      if (!foundNetworkEntry) {
        const pool = V4_POOLS[entry.token.chainId]
        const token: TokenWithAmount & TokenWithLogo = { ...pool.ticket, amount: 0n }

        rows.push({
          id: `v4Migration-${token.chainId}-${token.address}-rewards`,
          cells: {
            token: { content: <TokenBadge token={token} /> },
            status: { content: <StatusItem />, position: 'center' },
            rewards: {
              content: <RewardsItem chainId={token.chainId} userAddress={userAddress} />,
              position: 'center'
            },
            balance: { content: <BalanceItem token={token} />, position: 'center' },
            manage: {
              content: (
                <ManageItem
                  userAddress={userAddress}
                  migration={{ token, contractAddress: pool.address, destination: pool.migrateTo }}
                />
              ),
              position: 'right'
            }
          }
        })
      }
    })

    return rows
  }, [userV4Balances, userV4Rewards, userAddress])

  const tableData: TableData = {
    headers: {
      token: { content: 'Token' },
      status: { content: 'Status', position: 'center' },
      rewards: { content: 'Unclaimed Rewards', position: 'center' },
      balance: { content: 'Your Balance', position: 'center' },
      manage: { content: 'Manage', position: 'right' }
    },
    rows: tableRows
  }

  if (isMobile) {
    const networksWithBalance = userV4Balances.map((e) => e.token.chainId)

    return (
      <div className='w-full flex flex-col gap-4 items-center'>
        {userV4Balances.map((migration) => (
          <V4MigrationCard
            key={`v4Migration-${migration.token.chainId}-${migration.contractAddress}`}
            userAddress={userAddress}
            migration={migration}
            className='w-full max-w-md'
          />
        ))}
        {userV4Rewards
          .filter((e) => !networksWithBalance.includes(e.token.chainId))
          .map((entry) => {
            const pool = V4_POOLS[entry.token.chainId]
            const token: TokenWithAmount & TokenWithLogo = { ...pool.ticket, amount: 0n }

            return (
              <V4MigrationCard
                key={`v4Migration-${token.chainId}-${token.address}-rewards`}
                userAddress={userAddress}
                migration={{ token, contractAddress: pool.address, destination: pool.migrateTo }}
                className='w-full max-w-md'
              />
            )
          })}
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
        gridColsClassName='grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.5fr)]'
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
  userAddress: Address
  migration: V4BalanceToMigrate
  className?: string
}

const V4MigrationCard = (props: V4MigrationCardProps) => {
  const { userAddress, migration, className } = props

  const cardData = [
    { label: 'Status', content: <StatusItem className='text-sm' /> },
    {
      label: 'Unclaimed Rewards',
      content: <RewardsItem chainId={migration.token.chainId} userAddress={userAddress} />
    },
    {
      label: 'Your Balance',
      content: <BalanceItem token={migration.token} className='!items-end text-sm text-right' />
    }
  ] satisfies {
    label: string
    content: ReactNode
  }[]

  return (
    <div
      className={classNames(
        'flex flex-col gap-4 items-start bg-pt-transparent rounded-lg px-3 pt-3 pb-6',
        className
      )}
    >
      <TokenBadge token={migration.token} />
      <div className='w-full flex flex-col gap-1 px-3'>
        {cardData.map((data, i) => (
          <div
            key={`cl-${i}-${migration.token.chainId}-${migration.contractAddress}`}
            className='flex items-center justify-between'
          >
            <span className='text-xs text-pt-purple-200'>{data.label}</span>
            {data.content}
          </div>
        ))}
      </div>
      <ManageItem
        userAddress={userAddress}
        migration={migration}
        fullSized={true}
        className='w-full justify-center'
      />
    </div>
  )
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

  if (!token.amount) {
    return <span className={className}>-</span>
  }

  return (
    <TokenValueAndAmount
      token={{ ...token, address: underlyingTokenAddress ?? token.address }}
      className={className}
      amountClassName='md:text-center'
    />
  )
}

interface ManageItemProps {
  userAddress: Address
  migration: V4BalanceToMigrate
  fullSized?: boolean
  className?: string
}

const ManageItem = (props: ManageItemProps) => {
  const { userAddress, migration, fullSized, className } = props

  const { refetch: refetchUserV4Balances } = useUserV4Balances(userAddress)
  const { refetch: refetchUserV4ClaimableRewards } = useUserV4ClaimableRewards(
    migration.token.chainId,
    userAddress
  )

  const migrationURL = `/migrate/v4/${migration.token.chainId}/${migration.token.address}`

  return (
    <div className={classNames('flex gap-2 items-center', className)}>
      {!!migration.token.amount ? (
        <>
          <WithdrawButton
            migration={migration}
            txOptions={{ onSuccess: refetchUserV4Balances }}
            hideWrongNetworkState={true}
            color='transparent'
            fullSized={fullSized}
            className='md:min-w-[6rem]'
          />
          <Link href={migrationURL} passHref={true} className='w-full'>
            <Button fullSized={fullSized}>Migrate</Button>
          </Link>
        </>
      ) : (
        <ClaimRewardsButton
          chainId={migration.token.chainId}
          userAddress={userAddress}
          txOptions={{ onSuccess: () => refetchUserV4ClaimableRewards() }}
          fullSized={fullSized}
          className='md:min-w-[6rem]'
        />
      )}
    </div>
  )
}
