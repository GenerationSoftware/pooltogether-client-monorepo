import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import { ChevronDoubleRightIcon } from '@heroicons/react/24/outline'
import { CurrencyValue, NetworkBadge, TokenIcon } from '@shared/react-components'
import { Button, Spinner } from '@shared/ui'
import { formatBigIntForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import Link from 'next/link'
import { ReactNode, useMemo, useState } from 'react'
import { Address, formatUnits } from 'viem'
import { SimpleBadge } from '@components/SimpleBadge'
import { SwapWidget } from '@components/SwapWidget'
import { V4_PROMOTIONS } from '@constants/config'
import { V4BalanceToMigrate } from '@hooks/useUserV4Balances'
import { useUserV4ClaimableRewards } from '@hooks/useUserV4ClaimableRewards'
import { useV4ClaimRewardsGasEstimate } from '@hooks/useV4ClaimRewardsGasEstimate'
import { ClaimRewardsButton } from './ClaimRewardsButton'
import { V4MigrationHeader } from './V4MigrationHeader'

export type V4MigrationStep = 'claim' | 'swap'

export interface V4MigrationProps {
  userAddress: Address
  migration: V4BalanceToMigrate
  className?: string
}

export const V4Migration = (props: V4MigrationProps) => {
  const { userAddress, migration, className } = props

  const [actionsCompleted, setActionsCompleted] = useState(0)

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
    swap: (
      <SwapContent
        migration={migration}
        onSuccess={() => setActionsCompleted(actionsCompleted + 1)}
      />
    )
  }

  const migrationActions = useMemo((): V4MigrationStep[] => {
    if (isRewardsClaimable) {
      return ['claim', 'swap']
    } else if (isRewardsClaimable !== undefined) {
      return ['swap']
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

interface SwapContentProps {
  migration: V4BalanceToMigrate
  onSuccess?: () => void
  className?: string
}

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

  return <SwapWidget config={swapWidgetConfig} onSuccess={onSuccess} className={className} />
}
