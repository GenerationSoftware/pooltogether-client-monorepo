import { TokenIcon } from '@shared/react-components'
import { NETWORK, POOL_TOKEN_ADDRESSES } from '@shared/utilities'
import classNames from 'classnames'
import { Address } from 'viem'
import { SimpleBadge } from '@components/SimpleBadge'
import { V3MigrationsTable } from './V3MigrationsTable'

export interface V3MigrationsProps {
  userAddress: Address
  showPooly?: boolean
  className?: string
}

export const V3Migrations = (props: V3MigrationsProps) => {
  const { userAddress, showPooly, className } = props

  return (
    <section className={classNames('w-full flex flex-col gap-6 items-center', className)}>
      <V3Badge />
      <V3MigrationsTable userAddress={userAddress} showPooly={showPooly} />
    </section>
  )
}

const V3Badge = () => (
  <SimpleBadge>
    <TokenIcon
      token={{ chainId: NETWORK.mainnet, address: POOL_TOKEN_ADDRESSES[NETWORK.mainnet] }}
    />
    V3 Pools
  </SimpleBadge>
)
