import classNames from 'classnames'
import { Address } from 'viem'
import { useUserV3Balances } from '@hooks/useUserV3Balances'
import { V3PodMigration } from './V3PodMigration'
import { V3PoolMigration } from './V3PoolMigration'

export interface V3MigrationsProps {
  userAddress: Address
  className?: string
}

export const V3Migrations = (props: V3MigrationsProps) => {
  const { userAddress, className } = props

  const { data: userV3Balances } = useUserV3Balances(userAddress)

  return (
    <section className={classNames('flex flex-col', className)}>
      <span>{'V3 -> V5'}</span>
      {userV3Balances.map((migration) => {
        if (migration.type === 'pool') {
          return (
            <V3PoolMigration
              key={`v3PoolMigration-${migration.token.chainId}-${migration.contractAddress}`}
              migration={migration}
            />
          )
        } else if (migration.type === 'pod') {
          return (
            <V3PodMigration
              key={`v3PodMigration-${migration.token.chainId}-${migration.contractAddress}`}
              migration={migration}
            />
          )
        } else {
          return <></>
        }
      })}
    </section>
  )
}
