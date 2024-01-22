import { TokenIcon } from '@shared/react-components'
import { NETWORK, POOL_TOKEN_ADDRESSES } from '@shared/utilities'
import classNames from 'classnames'
import { Address } from 'viem'
import { SimpleBadge } from '@components/SimpleBadge'
import { V5MigrationsTable } from './V5MigrationsTable'

export interface V5MigrationsProps {
  userAddress: Address
  showPooly?: boolean
  className?: string
}

export const V5Migrations = (props: V5MigrationsProps) => {
  const { userAddress, showPooly, className } = props

  return (
    <section className={classNames('w-full flex flex-col gap-6 items-center', className)}>
      <V5Badge />
      <V5MigrationsTable userAddress={userAddress} showPooly={showPooly} />
    </section>
  )
}

const V5Badge = () => (
  <SimpleBadge>
    <TokenIcon
      token={{ chainId: NETWORK.mainnet, address: POOL_TOKEN_ADDRESSES[NETWORK.mainnet] }}
    />
    V5 Vaults
  </SimpleBadge>
)
