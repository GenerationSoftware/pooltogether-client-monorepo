import {
  useGasCostEstimates,
  useTokenBalance,
  useVault,
  useVaultTokenAddress
} from '@generationsoftware/hyperstructure-react-hooks'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import { ChevronDoubleRightIcon } from '@heroicons/react/24/outline'
import { CurrencyValue, NetworkBadge, TokenIcon } from '@shared/react-components'
import { Button, Spinner } from '@shared/ui'
import { formatBigIntForDisplay, sToMs } from '@shared/utilities'
import classNames from 'classnames'
import Link from 'next/link'
import { ReactNode, useMemo, useState } from 'react'
import { Address, formatUnits } from 'viem'
import { DepositContent } from '@components/DepositContent'
import { SimpleBadge } from '@components/SimpleBadge'
import { SwapWidget } from '@components/SwapWidget'
import { V4_POOLS, V4_PROMOTIONS } from '@constants/config'
import { v4PrizePoolABI } from '@constants/v4PrizePoolABI'
import { V4BalanceToMigrate } from '@hooks/useUserV4Balances'
import { useUserV4ClaimableRewards } from '@hooks/useUserV4ClaimableRewards'
import { useV4ClaimRewardsGasEstimate } from '@hooks/useV4ClaimRewardsGasEstimate'
import { ClaimRewardsButton } from './ClaimRewardsButton'
import { V4MigrationHeader } from './V4MigrationHeader'
import { WithdrawButton } from './WithdrawButton'

export type V4MigrationStep = 'claim' | 'withdraw' | 'swap' | 'deposit'

export interface V4MigrationProps {
  userAddress: Address
  migration: V4BalanceToMigrate
  className?: string
}

export const V4Migration = (props: V4MigrationProps) => {
  const { userAddress, migration, className } = props

  const [actionsCompleted, setActionsCompleted] = useState(0)
  const [swappedAmountOut, setSwappedAmountOut] = useState(0n)

  const { data: claimable, isFetched: isFetchedClaimable } = useUserV4ClaimableRewards(
    migration.token.chainId,
    userAddress
  )

  const isRewardsClaimable =
    isFetchedClaimable || !V4_PROMOTIONS[migration.token.chainId]
      ? !!claimable && !!Object.keys(claimable.rewards).length
      : undefined

  const allMigrationActions: Record<V4MigrationStep, ReactNode> = {
    claim: (
      <ClaimContent
        chainId={migration.token.chainId}
        userAddress={userAddress}
        onSuccess={() => setActionsCompleted(actionsCompleted + 1)}
      />
    ),
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
        onSuccess={(amount) => {
          setSwappedAmountOut(amount)
          setActionsCompleted(actionsCompleted + 1)
        }}
      />
    ),
    deposit: (
      <DepositContent
        userAddress={userAddress}
        destination={migration.destination}
        depositAmount={swappedAmountOut}
        onSuccess={() => setActionsCompleted(actionsCompleted + 1)}
      />
    )
  }

  const migrationActions = useMemo((): V4MigrationStep[] => {
    if (isRewardsClaimable) {
      return ['claim', 'withdraw', 'swap', 'deposit']
    } else if (isRewardsClaimable !== undefined) {
      return ['withdraw', 'swap', 'deposit']
    } else {
      return []
    }
  }, [allMigrationActions, isRewardsClaimable])

  return (
    <div className={classNames('w-full flex flex-col gap-16 items-center', className)}>
      <V4MigrationHeader
        migration={migration}
        actions={migrationActions}
        actionsCompleted={actionsCompleted}
      />
      {!!migrationActions.length ? (
        actionsCompleted < migrationActions.length &&
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

interface ClaimContentProps {
  chainId: number
  userAddress: Address
  onSuccess?: () => void
  className?: string
}

const ClaimContent = (props: ClaimContentProps) => {
  const { chainId, userAddress, onSuccess, className } = props

  const { data: claimable } = useUserV4ClaimableRewards(chainId, userAddress)

  const { data: gasEstimate, isFetched: isFetchedGasEstimate } = useV4ClaimRewardsGasEstimate(
    chainId,
    userAddress
  )

  if (claimable === undefined) {
    return <Spinner />
  }

  return (
    <div
      className={classNames(
        'w-full max-w-xl flex flex-col gap-6 items-center px-8 py-11 bg-pt-purple-700 rounded-md',
        className
      )}
    >
      <NetworkBadge chainId={chainId} />
      <div className='flex flex-col gap-2 items-center'>
        <span className='text-sm font-semibold text-pt-purple-100'>Claim Your Rewards:</span>
        <SimpleBadge className='gap-2 !text-2xl font-semibold'>
          {formatBigIntForDisplay(claimable.total, claimable.token.decimals)}
          <TokenIcon token={claimable.token} />
          <span className='text-pt-purple-200'>{claimable.token.symbol}</span>
        </SimpleBadge>
        <span className='flex gap-1 items-center text-sm font-semibold text-pt-purple-100'>
          Estimated Network Fee:{' '}
          {isFetchedGasEstimate && !!gasEstimate ? (
            <CurrencyValue baseValue={gasEstimate.totalGasEth} />
          ) : (
            <Spinner />
          )}
        </span>
      </div>
      <ClaimRewardsButton
        chainId={chainId}
        userAddress={userAddress}
        txOptions={{ onSuccess }}
        fullSized={true}
      />
      <button
        onClick={onSuccess}
        className='flex gap-1 items-center text-sm hover:text-pt-purple-100'
      >
        Skip claiming rewards <ChevronDoubleRightIcon className='w-4 h-4' />
      </button>
    </div>
  )
}

interface WithdrawContentProps {
  userAddress: Address
  migration: V4BalanceToMigrate
  onSuccess?: () => void
  className?: string
}

const WithdrawContent = (props: WithdrawContentProps) => {
  const { userAddress, migration, onSuccess, className } = props

  const prizePool = V4_POOLS[migration.token.chainId]

  const { data: gasEstimates, isFetched: isFetchedGasEstimates } = useGasCostEstimates(
    migration.token.chainId,
    {
      address: prizePool.address,
      abi: v4PrizePoolABI,
      functionName: 'withdrawFrom',
      args: [userAddress, migration.token.amount],
      account: userAddress
    },
    { refetchInterval: sToMs(10) }
  )

  return (
    <div
      className={classNames(
        'w-full max-w-xl flex flex-col gap-6 items-center px-8 py-11 bg-pt-purple-700 rounded-md',
        className
      )}
    >
      <NetworkBadge chainId={migration.token.chainId} />
      <span className='text-sm font-semibold text-pt-purple-100'>Withdraw From V4:</span>
      <SimpleBadge className='gap-2 !text-2xl font-semibold'>
        {formatBigIntForDisplay(migration.token.amount, migration.token.decimals)}
        <TokenIcon token={{ ...migration.token, address: prizePool.underlyingTokenAddress }} />
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
      <WithdrawButton migration={migration} txOptions={{ onSuccess }} fullSized={true} />
    </div>
  )
}

interface SwapContentProps {
  userAddress: Address
  migration: V4BalanceToMigrate
  onSuccess?: (amount: bigint) => void
  className?: string
}

const SwapContent = (props: SwapContentProps) => {
  const { userAddress, migration, onSuccess, className } = props

  const underlyingTokenAddress = V4_POOLS[migration.token.chainId].underlyingTokenAddress

  const toVault = useVault(migration.destination)
  const { data: toTokenAddress } = useVaultTokenAddress(toVault)

  const { data: fromToken } = useTokenBalance(
    migration.token.chainId,
    userAddress,
    underlyingTokenAddress
  )

  const swapWidgetConfig = useMemo(() => {
    return {
      fromChain: migration.token.chainId,
      fromToken: underlyingTokenAddress,
      fromAmount: !!fromToken
        ? formatUnits(fromToken.amount, fromToken.decimals)
        : formatUnits(migration.token.amount, migration.token.decimals),
      toChain: migration.destination.chainId,
      toToken: toTokenAddress
    }
  }, [migration, underlyingTokenAddress, toTokenAddress])

  return <SwapWidget config={swapWidgetConfig} onSuccess={onSuccess} className={className} />
}
