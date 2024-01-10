import { formatBigIntForDisplay, getNiceNetworkNameByChainId } from '@shared/utilities'
import classNames from 'classnames'
import { V3BalanceToMigrate } from '@hooks/useUserV3Balances'
import { WithdrawPoolButton } from './WithdrawPoolButton'

export interface V3PoolMigrationProps {
  migration: V3BalanceToMigrate
  className?: string
}

export const V3PoolMigration = (props: V3PoolMigrationProps) => {
  const { migration, className } = props

  return (
    <div className={classNames('flex flex-col', className)}>
      <span>{getNiceNetworkNameByChainId(migration.token.chainId)}</span>
      <span>
        {formatBigIntForDisplay(migration.token.amount, migration.token.decimals)}{' '}
        {migration.token.symbol} ({migration.type})
      </span>
      <WithdrawPoolButton migration={migration} />
    </div>
  )
}
