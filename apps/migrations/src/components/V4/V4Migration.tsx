import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import dynamic from 'next/dynamic'
import { ReactNode, useMemo, useState } from 'react'
import { Address, formatUnits } from 'viem'
import { V4_PROMOTIONS } from '@constants/config'
import { V4BalanceToMigrate } from '@hooks/useUserV4Balances'
import { useUserV4ClaimableRewards } from '@hooks/useUserV4ClaimableRewards'
import { V4MigrationHeader } from './V4MigrationHeader'

const SwapWidget = dynamic(() => import('../SwapWidget').then((module) => module.SwapWidget), {
  ssr: false,
  loading: () => <Spinner />
})

export interface V4MigrationProps {
  userAddress: Address
  migration: V4BalanceToMigrate
  className?: string
}

export const V4Migration = (props: V4MigrationProps) => {
  const { userAddress, migration, className } = props

  const { data: claimable, isFetched: isFetchedClaimable } = useUserV4ClaimableRewards(
    migration.token.chainId,
    userAddress
  )

  const isRewardsClaimable =
    isFetchedClaimable || !V4_PROMOTIONS[migration.token.chainId]
      ? !!claimable && !!Object.keys(claimable.rewards).length
      : undefined

  const allMigrationActions = {
    claim: <ClaimContent />,
    swap: <SwapContent migration={migration} />
  } as const satisfies { [name: string]: ReactNode }

  const migrationActions = useMemo((): (keyof typeof allMigrationActions)[] => {
    if (isRewardsClaimable) {
      return ['claim', 'swap']
    } else if (isRewardsClaimable !== undefined) {
      return ['swap']
    } else {
      return []
    }
  }, [allMigrationActions, isRewardsClaimable])

  const [actionsCompleted, setActionsCompleted] = useState(0)

  return (
    <div className={classNames('w-full flex flex-col gap-32 items-center', className)}>
      <V4MigrationHeader
        migration={migration}
        actions={migrationActions}
        actionsCompleted={actionsCompleted}
      />
      {!!migrationActions?.length ? (
        allMigrationActions[migrationActions[actionsCompleted]]
      ) : (
        <Spinner />
      )}
    </div>
  )
}

interface ClaimContentProps {
  className?: string
}

const ClaimContent = (props: ClaimContentProps) => {
  const { className } = props

  return <>CLAIM CONTENT</>
}

interface SwapContentProps {
  migration: V4BalanceToMigrate
  className?: string
}

const SwapContent = (props: SwapContentProps) => {
  const { migration, className } = props

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
