import {
  useTokens,
  useUserVaultTokenBalance,
  useVault
} from '@generationsoftware/hyperstructure-react-hooks'
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
import { OLD_V5_VAULTS, SUPPORTED_NETWORKS, V5_TAG } from '@constants/config'
import { useUserV5Balances, V5BalanceToMigrate } from '@hooks/useUserV5Balances'
import {
  useAllUserV5ClaimableRewards,
  useUserV5ClaimableRewards
} from '@hooks/useUserV5ClaimableRewards'
import { ClaimRewardsButton } from './ClaimRewardsButton'
import { WithdrawButton } from './WithdrawButton'

export interface V5MigrationsTableProps {
  userAddress: Address
  showPooly?: boolean
  className?: string
}

export const V5MigrationsTable = (props: V5MigrationsTableProps) => {
  const { userAddress, showPooly, className } = props

  const { data: userV5Balances } = useUserV5Balances(userAddress)
  const { data: userV5Rewards } = useAllUserV5ClaimableRewards(userAddress)

  const { isMobile } = useScreenSize()

  const tableRows = useMemo(() => {
    const rows: TableData['rows'] = userV5Balances.map((migration) => ({
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

    SUPPORTED_NETWORKS.forEach((network) => {
      OLD_V5_VAULTS[network]?.forEach((_vault) => {
        const vaultInfo = _vault.vault

        const foundVaultRewards = userV5Rewards.find(
          (e) => e.chainId === vaultInfo.chainId && e.vaultAddress === vaultInfo.address
        )

        if (!!foundVaultRewards) {
          const foundVaultBalance = userV5Balances.find(
            (e) =>
              e.token.chainId === vaultInfo.chainId &&
              e.token.address.toLowerCase() === vaultInfo.address
          )

          if (!foundVaultBalance) {
            const token: TokenWithAmount & TokenWithLogo = { ...vaultInfo, amount: 0n }
            const migration: V5BalanceToMigrate = {
              token,
              vaultInfo,
              destination: _vault.migrateTo
            }

            rows.push({
              id: `v5Migration-${token.chainId}-${token.address}`,
              cells: {
                token: { content: <TokenBadge token={{ ...token, ...vaultInfo }} /> },
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
            })
          }
        }
      })
    })

    return rows
  }, [userV5Balances, userV5Rewards, userAddress])

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
        {userV5Balances.map((migration) => (
          <V5MigrationCard
            key={`v5Migration-${migration.token.chainId}-${migration.token.address}`}
            userAddress={userAddress}
            migration={migration}
            className='w-full max-w-md'
          />
        ))}
        {SUPPORTED_NETWORKS.map((network) => {
          const vaultAddressesWithBalance = userV5Balances
            .filter((e) => e.token.chainId === network)
            .map((e) => e.token.address.toLowerCase() as Lowercase<Address>)

          const vaultAddressesWithRewards = [
            ...new Set(
              userV5Rewards
                .filter((e) => e.chainId === network)
                .map((e) => e.vaultAddress.toLowerCase() as Lowercase<Address>)
            )
          ]

          return Object.values(OLD_V5_VAULTS[network] ?? {})
            .filter(
              (e) =>
                vaultAddressesWithRewards.includes(e.vault.address) &&
                !vaultAddressesWithBalance.includes(e.vault.address)
            )
            .map((entry) => {
              const token: TokenWithAmount & TokenWithLogo = { ...entry.vault, amount: 0n }
              const migration: V5BalanceToMigrate = {
                token,
                vaultInfo: entry.vault,
                destination: entry.migrateTo
              }

              return (
                <V5MigrationCard
                  key={`v5Migration-${token.chainId}-${token.address}`}
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

  const { data: claimable, isFetched: isFetchedClaimable } = useUserV5ClaimableRewards(
    migration.vaultInfo.chainId,
    migration.vaultInfo.address,
    userAddress
  )

  const claimableTokenAddresses = new Set(
    claimable.map((entry) => entry.tokenAddress.toLowerCase() as Lowercase<Address>)
  )
  const { data: tokenData, isFetched: isFetchedTokenData } = useTokens(
    migration.vaultInfo.chainId,
    [...claimableTokenAddresses]
  )

  if (
    !isFetchedClaimable ||
    (!!claimableTokenAddresses.size && (!isFetchedTokenData || !tokenData))
  ) {
    return <Spinner />
  }

  if (!claimableTokenAddresses.size) {
    return <>-</>
  }

  const firstTokenAddress = [...claimableTokenAddresses][0]
  const firstToken = tokenData?.[firstTokenAddress]
  const firstTokenAmount = claimable.reduce(
    (a, b) => a + (b.tokenAddress === firstTokenAddress ? b.total : 0n),
    0n
  )

  return (
    <div className={className}>
      {!!firstTokenAmount && !!firstToken ? (
        <div className='flex flex-col items-center'>
          <span className='flex gap-1 items-center'>
            <span className='text-xl font-medium text-pt-purple-100'>
              {formatBigIntForDisplay(firstTokenAmount, firstToken.decimals)}
            </span>
            <span className='text-sm text-pt-purple-400'>{firstToken.symbol}</span>
          </span>
          {claimableTokenAddresses.size > 1 && (
            <span className='text-sm text-pt-purple-200 leading-none'>
              + {claimableTokenAddresses.size - 1} other tokens
            </span>
          )}
        </div>
      ) : (
        <>-</>
      )}
    </div>
  )
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

  if (!underlyingToken.amount) {
    return <span className={className}>-</span>
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
  const { refetch: refetchUserV5ClaimableRewards } = useUserV5ClaimableRewards(
    migration.token.chainId,
    migration.vaultInfo.address,
    userAddress
  )

  const migrationURL = `/migrate/v5/${migration.token.chainId}/${migration.token.address}`

  return (
    <div className={classNames('flex gap-2 items-center', className)}>
      {!!migration.token.amount ? (
        <>
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
        </>
      ) : (
        <ClaimRewardsButton
          chainId={migration.token.chainId}
          vaultAddress={migration.vaultInfo.address}
          userAddress={userAddress}
          txOptions={{ onSuccess: () => refetchUserV5ClaimableRewards() }}
          fullSized={fullSized}
          className='md:min-w-[6rem]'
        />
      )}
    </div>
  )
}
