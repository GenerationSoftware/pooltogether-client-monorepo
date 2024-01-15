import { Spinner } from '@shared/ui'
import { NETWORK } from '@shared/utilities'
import classNames from 'classnames'
import dynamic from 'next/dynamic'
import { Address } from 'viem'
import { useUserV3Balances } from '@hooks/useUserV3Balances'
import { useUserV4Balances } from '@hooks/useUserV4Balances'
import { V3Migrations } from './V3/V3Migrations'
import { V4Migrations } from './V4/V4Migrations'

const SwapWidget = dynamic(() => import('./SwapWidget').then((module) => module.SwapWidget), {
  ssr: false,
  loading: () => <Spinner />
})

export interface MigrationsProps {
  userAddress: Address
  className?: string
}

export const Migrations = (props: MigrationsProps) => {
  const { userAddress, className } = props

  const { data: userV4Balances, isFetched: isFetchedUserV4Balances } =
    useUserV4Balances(userAddress)
  const { data: userV3Balances, isFetched: isFetchedUserV3Balances } =
    useUserV3Balances(userAddress)

  const isFetched = isFetchedUserV4Balances && isFetchedUserV3Balances
  const isEmpty = isFetched && !userV4Balances.length && !userV3Balances.length

  return (
    <div className={classNames('flex flex-col gap-8', className)}>
      {!isFetched && <Spinner />}
      {isFetched && !isEmpty && (
        <>
          {!!userV4Balances.length && <V4Migrations userAddress={userAddress} />}
          {!!userV3Balances.length && <V3Migrations userAddress={userAddress} />}
          {/* TODO: dynamically set route based on migration path */}
          <SwapWidget
            config={{
              toChain: NETWORK.optimism,
              toToken: '0xE3B3a464ee575E8E25D2508918383b89c832f275'
            }}
          />
        </>
      )}
      {isFetched && isEmpty && (
        // TODO: improve empty content here
        <span>nothing to migrate</span>
      )}
    </div>
  )
}
