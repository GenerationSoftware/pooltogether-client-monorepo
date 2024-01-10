import classNames from 'classnames'
import { Address } from 'viem'
import { useUserV4Balances } from '@hooks/useUserV4Balances'
import { V4Migration } from './V4Migration'

export interface V4MigrationsProps {
  userAddress: Address
  className?: string
}

export const V4Migrations = (props: V4MigrationsProps) => {
  const { userAddress, className } = props

  const { data: userV4Balances } = useUserV4Balances(userAddress)

  return (
    <section className={classNames('flex flex-col', className)}>
      <span>{'V4 -> V5'}</span>
      {userV4Balances.map((migration) => (
        <V4Migration
          key={`v4Migration-${migration.token.chainId}-${migration.contractAddress}`}
          migration={migration}
        />
      ))}
    </section>
  )
}
