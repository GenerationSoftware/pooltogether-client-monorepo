import {
  useGasCostEstimates,
  useTokenBalance
} from '@generationsoftware/hyperstructure-react-hooks'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import { CurrencyValue, NetworkBadge, TokenIcon } from '@shared/react-components'
import { Button, Spinner } from '@shared/ui'
import { formatBigIntForDisplay, sToMs } from '@shared/utilities'
import classNames from 'classnames'
import Link from 'next/link'
import { ReactNode, useMemo, useState } from 'react'
import { Address, formatUnits } from 'viem'
import { SimpleBadge } from '@components/SimpleBadge'
import { SwapWidget } from '@components/SwapWidget'
import { SupportedNetwork, V3_POOLS } from '@constants/config'
import { v3PodABI } from '@constants/v3PodABI'
import { v3PoolABI } from '@constants/v3PoolABI'
import { V3BalanceToMigrate } from '@hooks/useUserV3Balances'
import { V3MigrationHeader } from './V3MigrationHeader'
import { WithdrawPodButton } from './WithdrawPodButton'
import { WithdrawPoolButton } from './WithdrawPoolButton'

export type V3MigrationStep = 'withdraw' | 'swap'

export interface V3MigrationProps {
  userAddress: Address
  migration: V3BalanceToMigrate
  className?: string
}

export const V3Migration = (props: V3MigrationProps) => {
  const { userAddress, migration, className } = props

  const [actionsCompleted, setActionsCompleted] = useState(0)

  const allMigrationActions: Record<V3MigrationStep, ReactNode> = {
    withdraw: (
      <WithdrawContent
        userAddress={userAddress}
        migration={migration}
        onSuccess={() => setActionsCompleted(actionsCompleted + 1)}
      />
    ),
    swap: (
      <SwapContent
        userAddress={userAddress}
        migration={migration}
        onSuccess={() => setActionsCompleted(actionsCompleted + 1)}
      />
    )
  }

  const migrationActions: V3MigrationStep[] = ['withdraw', 'swap']

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

  const { data: gasEstimates, isFetched: isFetchedGasEstimates } = useGasCostEstimates(
    migration?.token.chainId,
    {
      address: migration?.contractAddress,
      abi: migration?.type === 'pool' ? v3PoolABI : v3PodABI,
      functionName: migration.type === 'pool' ? 'withdrawInstantlyFrom' : 'withdraw',
      args:
        migration?.type === 'pool'
          ? [userAddress, migration?.token.amount, migration?.token.address, 0n]
          : [migration?.token.amount, 0n]
    },
    { refetchInterval: sToMs(10) }
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
        {isFetchedGasEstimates && !!gasEstimates ? (
          <CurrencyValue baseValue={gasEstimates.totalGasEth} />
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
  userAddress: Address
  migration: V3BalanceToMigrate
  onSuccess?: () => void
  className?: string
}

const SwapContent = (props: SwapContentProps) => {
  const { userAddress, migration, onSuccess, className } = props

  const { data: underlyingToken } = useTokenBalance(
    migration.token.chainId,
    userAddress,
    migration.underlyingTokenAddress
  )

  const swapWidgetConfig = useMemo(() => {
    return {
      fromChain: migration.token.chainId,
      fromToken: migration.underlyingTokenAddress,
      fromAmount: !!underlyingToken
        ? formatUnits(underlyingToken.amount, underlyingToken.decimals)
        : undefined,
      toChain: migration.destination.chainId,
      toToken: migration.destination.address
    }
  }, [migration, underlyingToken])

  return <SwapWidget config={swapWidgetConfig} onSuccess={onSuccess} className={className} />
}
