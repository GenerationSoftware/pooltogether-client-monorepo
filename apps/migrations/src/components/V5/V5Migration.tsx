import {
  useTokenBalance,
  useVault,
  useVaultTokenAddress
} from '@generationsoftware/hyperstructure-react-hooks'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import { CurrencyValue, NetworkBadge, TokenIcon } from '@shared/react-components'
import { Button, Spinner } from '@shared/ui'
import { formatBigIntForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import Link from 'next/link'
import { ReactNode, useMemo, useState } from 'react'
import { Address, formatUnits } from 'viem'
import { SimpleBadge } from '@components/SimpleBadge'
import { SwapWidget } from '@components/SwapWidget'
import { V5BalanceToMigrate } from '@hooks/useUserV5Balances'
import { useV5WithdrawGasEstimate } from '@hooks/useV5WithdrawGasEstimate'
import { V5MigrationHeader } from './V5MigrationHeader'
import { WithdrawButton } from './WithdrawButton'

export interface V5MigrationProps {
  userAddress: Address
  migration: V5BalanceToMigrate
  className?: string
}

export const V5Migration = (props: V5MigrationProps) => {
  const { userAddress, migration, className } = props

  const [actionsCompleted, setActionsCompleted] = useState(0)

  const allMigrationActions = {
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
  } as const satisfies { [name: string]: ReactNode }

  const migrationActions: (keyof typeof allMigrationActions)[] = ['withdraw', 'swap']

  return (
    <div className={classNames('w-full flex flex-col gap-16 items-center', className)}>
      <V5MigrationHeader
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
  migration: V5BalanceToMigrate
  onSuccess?: () => void
  className?: string
}

const WithdrawContent = (props: WithdrawContentProps) => {
  const { userAddress, migration, onSuccess, className } = props

  const { data: gasEstimate, isFetched: isFetchedGasEstimate } = useV5WithdrawGasEstimate(
    userAddress,
    migration
  )

  return (
    <div
      className={classNames(
        'w-full max-w-xl flex flex-col gap-6 items-center px-8 py-11 bg-pt-purple-700 rounded-md',
        className
      )}
    >
      <NetworkBadge chainId={migration.token.chainId} />
      <span className='text-sm font-semibold text-pt-purple-100'>Withdraw From V5:</span>
      <SimpleBadge className='gap-2 !text-2xl font-semibold'>
        {formatBigIntForDisplay(migration.token.amount, migration.token.decimals)}
        <TokenIcon token={{ ...migration.token, ...migration.vaultInfo }} />
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
      <WithdrawButton
        migration={migration}
        txOptions={{ onSuccess }}
        includeTokenSymbol={true}
        fullSized={true}
      />
    </div>
  )
}

interface SwapContentProps {
  userAddress: Address
  migration: V5BalanceToMigrate
  onSuccess?: () => void
  className?: string
}

const SwapContent = (props: SwapContentProps) => {
  const { userAddress, migration, onSuccess, className } = props

  const vault = useVault(migration.vaultInfo)

  const { data: underlyingTokenAddress } = useVaultTokenAddress(vault)

  const { data: underlyingToken } = useTokenBalance(
    migration.token.chainId,
    userAddress,
    underlyingTokenAddress as Address
  )

  const swapWidgetConfig = useMemo(() => {
    return {
      fromChain: migration.token.chainId,
      fromToken: underlyingTokenAddress,
      fromAmount: !!underlyingToken
        ? formatUnits(underlyingToken.amount, underlyingToken.decimals)
        : undefined,
      toChain: migration.destination.chainId,
      toToken: migration.destination.address
    }
  }, [migration, underlyingToken])

  return <SwapWidget config={swapWidgetConfig} onSuccess={onSuccess} className={className} />
}
