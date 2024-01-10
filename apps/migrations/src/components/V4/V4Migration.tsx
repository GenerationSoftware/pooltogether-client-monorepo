import { formatBigIntForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import { V4BalanceToMigrate } from '@hooks/useUserV4Balances'

export interface V4MigrationProps {
  migration: V4BalanceToMigrate
  className?: string
}

export const V4Migration = (props: V4MigrationProps) => {
  const { migration, className } = props

  return (
    <div className={classNames('flex flex-col', className)}>
      <span>
        {formatBigIntForDisplay(migration.token.amount, migration.token.decimals)}{' '}
        {migration.token.symbol}
      </span>
    </div>
  )
}
