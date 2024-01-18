import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import dynamic from 'next/dynamic'
import { ReactNode, useMemo, useState } from 'react'
import { Address, formatUnits } from 'viem'
import { V4BalanceToMigrate } from '@hooks/useUserV4Balances'
import { useUserV4ClaimableRewards } from '@hooks/useUserV4ClaimableRewards'

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

  const allMigrationActions = {
    claim: { content: <ClaimContent /> },
    swap: { content: <SwapContent migration={migration} /> }
  } as const satisfies { [name: string]: { content: ReactNode } }

  const migrationActions = useMemo(() => {
    if (isFetchedClaimable) {
      const isRewardsClaimable = !!claimable && !!Object.keys(claimable.rewards).length

      if (isRewardsClaimable) {
        return [allMigrationActions.claim, allMigrationActions.swap]
      } else {
        return [allMigrationActions.swap]
      }
    }
  }, [allMigrationActions, claimable, isFetchedClaimable])

  const [actionsCompleted, setActionsCompleted] = useState(0)

  return (
    <div className={classNames('w-full flex flex-col gap-32 items-center', className)}>
      <div className={classNames('flex flex-col items-center text-center', className)}>
        <h2 className='font-averta font-semibold text-4xl'>
          Migrate your <span className='text-pt-purple-400'>{migration.token.symbol}</span> to
          PoolTogether V5
        </h2>
        {/* TODO: add action path based on what actions should be taken */}
      </div>
      {!!migrationActions ? migrationActions[actionsCompleted]?.content : <Spinner />}
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
