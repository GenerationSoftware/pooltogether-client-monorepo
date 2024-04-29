import { useTokensAcrossChains } from '@generationsoftware/hyperstructure-react-hooks'
import { useScreenSize } from '@shared/generic-react-hooks'
import { TokenValueAndAmount } from '@shared/react-components'
import { TokenWithAmount } from '@shared/types'
import { Button, Spinner, Table, TableData } from '@shared/ui'
import { formatBigIntForDisplay, lower } from '@shared/utilities'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode, useMemo } from 'react'
import { Address } from 'viem'
import { TokenBadge } from '@components/TokenBadge'
import { SUPPORTED_NETWORKS, SupportedNetwork, V3_POOLS, V3_REWARD_TOKENS } from '@constants/config'
import { useUserV3Balances, V3BalanceToMigrate } from '@hooks/useUserV3Balances'
import {
  useAllUserV3ClaimableRewards,
  useUserV3ClaimableRewards
} from '@hooks/useUserV3ClaimableRewards'
import { ClaimRewardsButton } from './ClaimRewardsButton'
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
  const { data: userV3Rewards } = useAllUserV3ClaimableRewards(userAddress)

  const ticketAddresses = useMemo(() => {
    const addresses: { [chainId: number]: Lowercase<Address>[] } = {}

    SUPPORTED_NETWORKS.forEach((network) => {
      const tokens = V3_POOLS[network].map((e) => e.ticketAddress)

      if (!!tokens.length) {
        if (addresses[network] === undefined) {
          addresses[network] = []
        }

        addresses[network].push(...tokens)
      }
    })

    return addresses
  }, [V3_POOLS])

  const { data: tickets } = useTokensAcrossChains(ticketAddresses)

  const { isMobile } = useScreenSize()

  const tableRows = useMemo(() => {
    const rows: TableData['rows'] = userV3Balances.map((migration) => ({
      id: `v3Migration-${migration.token.chainId}-${migration.contractAddress}`,
      cells: {
        token: { content: <TokenBadge token={migration.token} /> },
        status: {
          content: <StatusItem />,
          position: 'center'
        },
        rewards: {
          content: <RewardsItem userAddress={userAddress} migration={migration} />,
          position: 'center'
        },
        balance: { content: <BalanceItem token={migration.token} />, position: 'center' },
        manage: {
          content: <ManageItem userAddress={userAddress} migration={migration} />,
          position: 'right'
        }
      }
    }))

    SUPPORTED_NETWORKS.forEach((network) => {
      V3_POOLS[network]?.forEach((entry) => {
        const foundPoolRewards = userV3Rewards.find(
          (e) => e.chainId === network && e.ticketAddress === entry.ticketAddress
        )

        if (!!foundPoolRewards) {
          const foundPoolBalance = userV3Balances.find(
            (e) =>
              e.token.chainId === network && e.token.address.toLowerCase() === entry.ticketAddress
          )

          const ticket = tickets?.[network]?.[entry.ticketAddress]

          if (!foundPoolBalance && !!ticket) {
            const migration: V3BalanceToMigrate = {
              token: { ...ticket, amount: 0n },
              underlyingTokenAddress: entry.tokenAddress,
              contractAddress: entry.address,
              type: 'pool',
              destination: entry.migrateTo
            }

            rows.push({
              id: `v3Migration-${migration.token.chainId}-${migration.contractAddress}`,
              cells: {
                token: { content: <TokenBadge token={migration.token} /> },
                status: {
                  content: <StatusItem />,
                  position: 'center'
                },
                rewards: {
                  content: <RewardsItem userAddress={userAddress} migration={migration} />,
                  position: 'center'
                },
                balance: {
                  content: <BalanceItem token={migration.token} />,
                  position: 'center'
                },
                manage: {
                  content: <ManageItem userAddress={userAddress} migration={migration} />,
                  position: 'right'
                }
              }
            })
          }
        }
      })
    })

    return rows
  }, [userV3Balances, userV3Rewards, userAddress, tickets])

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
    return (
      <div className='w-full flex flex-col gap-4 items-center'>
        {userV3Balances.map((migration) => (
          <V3MigrationCard
            key={`v3Migration-${migration.token.chainId}-${migration.contractAddress}`}
            userAddress={userAddress}
            migration={migration}
            className='w-full max-w-md'
          />
        ))}
        {SUPPORTED_NETWORKS.map((network) => {
          const poolsWithBalance = userV3Balances
            .filter((e) => e.token.chainId === network)
            .map((e) => lower(e.token.address))

          const poolsWithRewards = [
            ...new Set(
              userV3Rewards.filter((e) => e.chainId === network).map((e) => e.ticketAddress)
            )
          ]

          return V3_POOLS[network]
            ?.filter(
              (e) =>
                poolsWithRewards.includes(e.ticketAddress) &&
                !poolsWithBalance.includes(e.ticketAddress) &&
                !!tickets?.[network]?.[e.ticketAddress]
            )
            .map((entry) => {
              const migration: V3BalanceToMigrate = {
                token: { ...tickets[network][entry.ticketAddress], amount: 0n },
                underlyingTokenAddress: entry.tokenAddress,
                contractAddress: entry.address,
                type: 'pool',
                destination: entry.migrateTo
              }

              return (
                <V3MigrationCard
                  key={`v3Migration-${migration.token.chainId}-${migration.contractAddress}`}
                  userAddress={userAddress}
                  migration={migration}
                  className='w-full max-w-md'
                />
              )
            })
        })}
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

interface V3MigrationCardProps {
  userAddress: Address
  migration: V3BalanceToMigrate
  className?: string
}

const V3MigrationCard = (props: V3MigrationCardProps) => {
  const { userAddress, migration, className } = props

  const cardData = [
    { label: 'Status', content: <StatusItem className='text-sm' /> },
    {
      label: 'Unclaimed Rewards',
      content: <RewardsItem userAddress={userAddress} migration={migration} />
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
  userAddress: Address
  migration: V3BalanceToMigrate
  className?: string
}

const RewardsItem = (props: RewardsItemProps) => {
  const { userAddress, migration, className } = props

  const { data: claimable, isFetched: isFetchedClaimable } = useUserV3ClaimableRewards(
    migration.token.chainId,
    lower(migration.token.address),
    userAddress
  )

  if (!isFetchedClaimable) {
    return <Spinner />
  }

  const rewardToken = V3_REWARD_TOKENS[migration.token.chainId]

  return (
    <div className={className}>
      {!!rewardToken && !!claimable?.rewards.amount ? (
        <span className='flex gap-1 items-center'>
          <span className='text-xl font-medium text-pt-purple-100'>
            {formatBigIntForDisplay(claimable.rewards.amount, rewardToken.decimals)}
          </span>
          <span className='text-sm text-pt-purple-400'>{rewardToken.symbol}</span>
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

  const underlyingTokenAddress = V3_POOLS[token.chainId as SupportedNetwork]?.find(
    (pool) => pool.ticketAddress === token.address.toLowerCase()
  )?.tokenAddress

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
  migration: V3BalanceToMigrate
  fullSized?: boolean
  className?: string
}

const ManageItem = (props: ManageItemProps) => {
  const { userAddress, migration, fullSized, className } = props

  const { refetch: refetchUserV3Balances } = useUserV3Balances(userAddress)
  const { refetch: refetchUserV3ClaimableRewards } = useUserV3ClaimableRewards(
    migration.token.chainId,
    lower(migration.token.address),
    userAddress
  )

  const migrationURL = `/migrate/v3/${migration.token.chainId}/${migration.token.address}`

  return (
    <div className={classNames('flex gap-2 items-center', className)}>
      {!!migration.token.amount ? (
        <>
          {migration.type === 'pool' && (
            <WithdrawPoolButton
              migration={migration}
              txOptions={{ onSuccess: refetchUserV3Balances }}
              hideWrongNetworkState={true}
              color='transparent'
              fullSized={fullSized}
              className='md:min-w-[6rem]'
            />
          )}
          {migration.type === 'pod' && (
            <WithdrawPodButton
              migration={migration}
              txOptions={{ onSuccess: refetchUserV3Balances }}
              hideWrongNetworkState={true}
              color='transparent'
              fullSized={fullSized}
              className='md:min-w-[6rem]'
            />
          )}
          {/* <Link href={migrationURL} passHref={true} className='w-full'> */}
          <Button fullSized={fullSized} disabled>
            Migrate (Soon)
          </Button>
          {/* </Link> */}
        </>
      ) : (
        <ClaimRewardsButton
          chainId={migration.token.chainId}
          ticketAddress={lower(migration.token.address)}
          userAddress={userAddress}
          txOptions={{ onSuccess: () => refetchUserV3ClaimableRewards() }}
          fullSized={fullSized}
          className='md:min-w-[6rem]'
        />
      )}
    </div>
  )
}
