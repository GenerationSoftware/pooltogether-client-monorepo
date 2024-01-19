import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import { CurrencyValue, NetworkBadge, TokenIcon } from '@shared/react-components'
import { Button, Spinner } from '@shared/ui'
import { formatBigIntForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ReactNode, useMemo, useState } from 'react'
import { Address, formatUnits } from 'viem'
import { SimpleBadge } from '@components/SimpleBadge'
import { SupportedNetwork, V3_POOLS } from '@constants/config'
import { useUserV3Balances, V3BalanceToMigrate } from '@hooks/useUserV3Balances'
import { useV3WithdrawGasEstimate } from '@hooks/useV3WithdrawGasEstimate'
import { V3MigrationHeader } from './V3MigrationHeader'
import { WithdrawPodButton } from './WithdrawPodButton'
import { WithdrawPoolButton } from './WithdrawPoolButton'

const SwapWidget = dynamic(() => import('../SwapWidget').then((module) => module.SwapWidget), {
  ssr: false,
  loading: () => <Spinner />
})

export interface V3MigrationProps {
  userAddress: Address
  migration: V3BalanceToMigrate
  className?: string
}

export const V3Migration = (props: V3MigrationProps) => {
  const { userAddress, migration, className } = props

  const [actionsCompleted, setActionsCompleted] = useState(0)

  const { refetch: refetchUserV3Balances } = useUserV3Balances(userAddress)

  const allMigrationActions = {
    withdraw: (
      <WithdrawContent
        userAddress={userAddress}
        migration={migration}
        onSuccess={() => {
          refetchUserV3Balances()
          setActionsCompleted(actionsCompleted + 1)
        }}
      />
    ),
    swap: <SwapContent migration={migration} />
  } as const satisfies { [name: string]: ReactNode }

  const migrationActions: (keyof typeof allMigrationActions)[] = ['withdraw', 'swap']

  return (
    <div className={classNames('w-full flex flex-col gap-16 items-center', className)}>
      <V3MigrationHeader
        migration={migration}
        actions={migrationActions}
        actionsCompleted={actionsCompleted}
      />
      {!!migrationActions?.length ? (
        allMigrationActions[
          migrationActions[Math.min(actionsCompleted, migrationActions.length - 1)]
        ]
      ) : (
        <Spinner />
      )}
      {actionsCompleted >= migrationActions.length && (
        <Link href='/' passHref={true}>
          <Button>
            <span className='flex gap-2 items-center'>
              <ArrowUturnLeftIcon className='h-5 w-5' /> Go back to migrate other prize tokens
            </span>
          </Button>
        </Link>
      )}
    </div>
  )
}

interface WithdrawContentProps {
  userAddress: Address
  migration: V3BalanceToMigrate
  onSuccess?: () => void
  className?: string
}

const WithdrawContent = (props: WithdrawContentProps) => {
  const { userAddress, migration, onSuccess, className } = props

  const { data: gasEstimate, isFetched: isFetchedGasEstimate } = useV3WithdrawGasEstimate(
    userAddress,
    migration
  )

  const v3UnderlyingTokenAddress = V3_POOLS[migration.token.chainId as SupportedNetwork]?.find(
    (pool) =>
      pool.ticketAddress === migration.token.address.toLowerCase() ||
      pool.podAddress === migration.token.address.toLowerCase()
  )?.tokenAddress

  return (
    <div
      className={classNames(
        'w-full max-w-xl flex flex-col gap-6 items-center px-8 py-11 bg-pt-purple-700 rounded-md',
        className
      )}
    >
      <NetworkBadge chainId={migration.token.chainId} />
      <span className='text-sm font-semibold text-pt-purple-100'>Withdraw From V3:</span>
      <SimpleBadge className='gap-2 !text-2xl font-semibold'>
        {formatBigIntForDisplay(migration.token.amount, migration.token.decimals)}
        <TokenIcon token={{ ...migration.token, address: v3UnderlyingTokenAddress }} />
        <span className='text-pt-purple-200'>{migration.token.symbol}</span>
      </SimpleBadge>
      <span className='flex gap-1 items-center text-sm font-semibold text-pt-purple-100'>
        Estimated Network Fee:{' '}
        {isFetchedGasEstimate && !!gasEstimate ? (
          <CurrencyValue baseValue={gasEstimate.totalGasEth} />
        ) : (
          <Spinner />
        )}
      </span>
      {migration.type === 'pool' && (
        <WithdrawPoolButton
          migration={migration}
          txOptions={{ onSuccess }}
          includeTokenSymbol={true}
          fullSized={true}
        />
      )}
      {migration.type === 'pod' && (
        <WithdrawPodButton
          migration={migration}
          txOptions={{ onSuccess }}
          includeTokenSymbol={true}
          fullSized={true}
        />
      )}
    </div>
  )
}

interface SwapContentProps {
  migration: V3BalanceToMigrate
  onSuccess?: () => void
  className?: string
}

// TODO: need to trigger onSuccess when a swap is completed and the destination is the expected destination token
const SwapContent = (props: SwapContentProps) => {
  const { migration, onSuccess, className } = props

  const swapWidgetConfig = useMemo(() => {
    return {
      fromChain: migration.token.chainId,
      fromToken: migration.token.address,
      fromAmount: formatUnits(migration.token.amount, migration.token.decimals),
      toChain: migration.destination.chainId,
      toToken: migration.destination.address
    }
  }, [migration])

  return <SwapWidget config={swapWidgetConfig} className={className} />
}
