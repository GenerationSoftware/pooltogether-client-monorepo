import classNames from 'classnames'
import { Address } from 'viem'
import { useUserV3Balances } from '@hooks/useUserV3Balances'
import { V3Migration } from './V3Migration'

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
      {userV3Balances.map((migration) => (
        <V3Migration
          key={`v3Migration-${migration.token.chainId}-${migration.contractAddress}`}
          migration={migration}
        />
      ))}
    </section>
  )
}
