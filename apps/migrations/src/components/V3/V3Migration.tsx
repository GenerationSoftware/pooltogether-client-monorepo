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
import { V3BalanceToMigrate } from '@hooks/useUserV3Balances'
import { V3MigrationHeader } from './V3MigrationHeader'

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

  const allMigrationActions = {
    withdraw: (
      <WithdrawContent
        userAddress={userAddress}
        migration={migration}
        onSuccess={() => setActionsCompleted(actionsCompleted + 1)}
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

  // TODO: withdraw content

  return <>withdraw content</>

  // return (
  //   <div
  //     className={classNames(
  //       'w-full max-w-xl flex flex-col gap-6 items-center px-8 py-11 bg-pt-purple-700 rounded-md',
  //       className
  //     )}
  //   >
  //     <NetworkBadge chainId={chainId} />
  //     <span className='text-sm font-semibold text-pt-purple-100'>Claim Your Rewards:</span>
  //     <SimpleBadge className='gap-2 !text-2xl font-semibold'>
  //       {formatBigIntForDisplay(claimable.total, claimable.token.decimals)}{' '}
  //       <TokenIcon token={{ chainId, ...claimable.token }} />{' '}
  //       <span className='text-pt-purple-200'>OP</span>
  //     </SimpleBadge>
  //     <span className='flex gap-1 items-center text-sm font-semibold text-pt-purple-100'>
  //       Estimated Network Fee:{' '}
  //       {isFetchedGasEstimate && !!gasEstimate ? (
  //         <CurrencyValue baseValue={gasEstimate.totalGasEth} />
  //       ) : (
  //         <Spinner />
  //       )}
  //     </span>
  //     <ClaimRewardsButton
  //       chainId={chainId}
  //       userAddress={userAddress}
  //       txOptions={{ onSuccess }}
  //       fullSized={true}
  //     />
  //   </div>
  // )
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
