import { formatBigIntForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import { V3BalanceToMigrate } from '@hooks/useUserV3Balances'

export interface V3MigrationProps {
  migration: V3BalanceToMigrate
  className?: string
}

export const V3Migration = (props: V3MigrationProps) => {
  const { migration, className } = props

  return (
    <div className={classNames('flex flex-col', className)}>
      <span>
        {formatBigIntForDisplay(migration.token.amount, migration.token.decimals)}{' '}
        {migration.token.symbol} ({migration.type})
      </span>
    </div>
  )
}
