import { formatBigIntForDisplay, getNiceNetworkNameByChainId } from '@shared/utilities'
import classNames from 'classnames'
import { V3BalanceToMigrate } from '@hooks/useUserV3Balances'
import { WithdrawPodButton } from './WithdrawPodButton'

export interface V3PodMigrationProps {
  migration: V3BalanceToMigrate
  className?: string
}

export const V3PodMigration = (props: V3PodMigrationProps) => {
  const { migration, className } = props

  return (
    <div className={classNames('flex flex-col', className)}>
      <span>{getNiceNetworkNameByChainId(migration.token.chainId)}</span>
      <span>
        {formatBigIntForDisplay(migration.token.amount, migration.token.decimals)}{' '}
        {migration.token.symbol} ({migration.type})
      </span>
      <WithdrawPodButton migration={migration} />
    </div>
  )
}
