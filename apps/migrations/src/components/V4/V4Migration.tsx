import classNames from 'classnames'
import { formatUnits } from 'viem'
import { SwapWidget } from '@components/SwapWidget'
import { V4BalanceToMigrate } from '@hooks/useUserV4Balances'

export interface V4MigrationProps {
  migration: V4BalanceToMigrate
  className?: string
}

export const V4Migration = (props: V4MigrationProps) => {
  const { migration, className } = props

  return (
    <div className={classNames('w-full flex flex-col gap-32 items-center', className)}>
      <Header migration={migration} />
      <SwapWidget
        config={{
          fromChain: migration.token.chainId,
          fromToken: migration.token.address,
          fromAmount: formatUnits(migration.token.amount, migration.token.decimals),
          toChain: migration.destination.chainId,
          toToken: migration.destination.address
        }}
      />
    </div>
  )
}

interface HeaderProps {
  migration: V4BalanceToMigrate
  className?: string
}

const Header = (props: HeaderProps) => {
  const { migration, className } = props

  return (
    <div className={classNames('flex flex-col items-center text-center', className)}>
      <h2 className='font-averta font-semibold text-4xl'>
        Migrate your <span className='text-pt-purple-400'>{migration.token.symbol}</span> to
        PoolTogether V5
      </h2>
      {/* TODO: add subtitle based on what actions should be taken */}
    </div>
  )
}
