import { useUserVaultTokenBalance, useVault } from '@generationsoftware/hyperstructure-react-hooks'
import { useScreenSize } from '@shared/generic-react-hooks'
import { TokenValueAndAmount } from '@shared/react-components'
import { Button, Spinner, Table, TableData } from '@shared/ui'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode, useMemo } from 'react'
import { Address } from 'viem'
import { TokenBadge } from '@components/TokenBadge'
import { V5_TAG } from '@constants/config'
import { useUserV5Balances, V5BalanceToMigrate } from '@hooks/useUserV5Balances'
import { WithdrawButton } from './WithdrawButton'

export interface V5MigrationsTableProps {
  userAddress: Address
  showPooly?: boolean
  className?: string
}

export const V5MigrationsTable = (props: V5MigrationsTableProps) => {
  const { userAddress, showPooly, className } = props

  const { data: userV5Balances } = useUserV5Balances(userAddress)

  const { isMobile } = useScreenSize()

  const tableData: TableData = {
    headers: {
      token: { content: 'Token' },
      status: { content: 'Status', position: 'center' },
      rewards: { content: 'Unclaimed Rewards', position: 'center' },
      balance: { content: 'Your Balance', position: 'center' },
      manage: { content: 'Manage', position: 'right' }
    },
    rows: userV5Balances.map((migration) => ({
      id: `v5Migration-${migration.token.chainId}-${migration.token.address}`,
      cells: {
        token: {
          content: <TokenBadge token={{ ...migration.token, ...migration.vaultInfo }} />
        },
        status: {
          content: <StatusItem tags={migration.vaultInfo.tags} />,
          position: 'center'
        },
        rewards: {
          content: <RewardsItem userAddress={userAddress} migration={migration} />,
          position: 'center'
        },
        balance: {
          content: <BalanceItem userAddress={userAddress} migration={migration} />,
          position: 'center'
        },
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
        {userV5Balances.map((migration) => (
          <V5MigrationCard
            key={`v5Migration-${migration.token.chainId}-${migration.token.address}`}
            userAddress={userAddress}
            migration={migration}
            className='w-full max-w-md'
          />
        ))}
      </div>
    )
  }

  return (
    <div className='relative w-full'>
      <Table
        keyPrefix='v5Migrations'
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

interface V5MigrationCardProps {
  userAddress: Address
  migration: V5BalanceToMigrate
  className?: string
}

const V5MigrationCard = (props: V5MigrationCardProps) => {
  const { userAddress, migration, className } = props

  const cardData = [
    {
      label: 'Status',
      content: <StatusItem tags={migration.vaultInfo.tags} className='text-sm' />
    },
    {
      label: 'Unclaimed Rewards',
      content: <RewardsItem userAddress={userAddress} migration={migration} />
    },
    {
      label: 'Your Balance',
      content: (
        <BalanceItem
          userAddress={userAddress}
          migration={migration}
          className='!items-end text-sm text-right'
        />
      )
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
      <TokenBadge token={{ ...migration.token, ...migration.vaultInfo }} />
      <div className='w-full flex flex-col gap-1 px-3'>
        {cardData.map((data, i) => (
          <div
            key={`cl-${i}-${migration.token.chainId}-${migration.token.address}`}
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
  tags?: V5_TAG[]
  className?: string
}

const StatusItem = (props: StatusItemProps) => {
  const { tags, className } = props

  const status = useMemo(() => {
    if (!!tags) {
      if (tags.includes('beta')) {
        return 'Beta Ended'
      } else if (tags.includes('replaced')) {
        return 'Better Vault Available'
      } else if (tags.includes('old-prize-pool')) {
        return 'Old Prize Pool Deployment'
      }
    }

    return 'Deprecated'
  }, [tags])

  return <span className={classNames('text-pt-purple-100', className)}>{status}</span>
}

interface RewardsItemProps {
  userAddress: Address
  migration: V5BalanceToMigrate
  className?: string
}

const RewardsItem = (props: RewardsItemProps) => {
  const { userAddress, migration, className } = props

  // TODO: query rewards from known twab rewards contracts (get address from vault info? extensions?)

  return <>-</>
}

interface BalanceItemProps {
  userAddress: Address
  migration: V5BalanceToMigrate
  className?: string
}

const BalanceItem = (props: BalanceItemProps) => {
  const { userAddress, migration, className } = props

  const vault = useVault(migration.vaultInfo)

  const { data: underlyingToken, isFetched } = useUserVaultTokenBalance(vault, userAddress)

  if (!isFetched) {
    return <Spinner />
  }

  if (!underlyingToken) {
    return <>?</>
  }

  return (
    <TokenValueAndAmount
      token={underlyingToken}
      className={className}
      amountClassName='md:text-center'
    />
  )
}

interface ManageItemProps {
  userAddress: Address
  migration: V5BalanceToMigrate
  fullSized?: boolean
  className?: string
}

const ManageItem = (props: ManageItemProps) => {
  const { userAddress, migration, fullSized, className } = props

  const { refetch: refetchUserV5Balances } = useUserV5Balances(userAddress)

  const migrationURL = `/migrate/v5/${migration.token.chainId}/${migration.token.address}`

  return (
    <div className={classNames('flex gap-2 items-center', className)}>
      <WithdrawButton
        migration={migration}
        txOptions={{ onSuccess: refetchUserV5Balances }}
        hideWrongNetworkState={true}
        color='transparent'
        fullSized={fullSized}
        className='md:min-w-[6rem]'
      />
      <Link href={migrationURL} passHref={true} className='w-full'>
        <Button fullSized={fullSized}>Migrate</Button>
      </Link>
    </div>
  )
}
