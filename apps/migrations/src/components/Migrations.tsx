import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import Image from 'next/image'
import { useEffect } from 'react'
import { Address } from 'viem'
import { useUserV3Balances } from '@hooks/useUserV3Balances'
import { useUserV4Balances } from '@hooks/useUserV4Balances'
import { useAllUserV4ClaimableRewards } from '@hooks/useUserV4ClaimableRewards'
import { useUserV5Balances } from '@hooks/useUserV5Balances'
import { useAllUserV5ClaimableRewards } from '@hooks/useUserV5ClaimableRewards'
import { V3Migrations } from './V3/V3Migrations'
import { V4Migrations } from './V4/V4Migrations'
import { V5Migrations } from './V5/V5Migrations'

export interface MigrationsProps {
  userAddress: Address
  className?: string
}

export const Migrations = (props: MigrationsProps) => {
  const { userAddress, className } = props

  const {
    data: userV5Balances,
    isFetched: isFetchedUserV5Balances,
    isFetching: isFetchingUserV5Balances,
    refetch: refetchUserV5Balances
  } = useUserV5Balances(userAddress)
  const {
    data: userV4Balances,
    isFetched: isFetchedUserV4Balances,
    isFetching: isFetchingUserV4Balances,
    refetch: refetchUserV4Balances
  } = useUserV4Balances(userAddress)
  const {
    data: userV3Balances,
    isFetched: isFetchedUserV3Balances,
    isFetching: isFetchingUserV3Balances,
    refetch: refetchUserV3Balances
  } = useUserV3Balances(userAddress)

  const {
    data: userV5Rewards,
    isFetched: isFetchedUserV5Rewards,
    isFetching: isFetchingUserV5Rewards,
    refetch: refetchUserV5Rewards
  } = useAllUserV5ClaimableRewards(userAddress)
  const {
    data: userV4Rewards,
    isFetched: isFetchedUserV4Rewards,
    isFetching: isFetchingUserV4Rewards,
    refetch: refetchUserV4Rewards
  } = useAllUserV4ClaimableRewards(userAddress)

  const isFetched =
    isFetchedUserV5Balances &&
    isFetchedUserV4Balances &&
    isFetchedUserV3Balances &&
    isFetchedUserV5Rewards &&
    isFetchedUserV4Rewards
  const isEmpty =
    isFetched &&
    !userV5Balances.length &&
    !userV4Balances.length &&
    !userV3Balances.length &&
    !userV5Rewards.length &&
    !userV4Rewards.length

  useEffect(() => {
    if (isFetchedUserV5Balances && !isFetchingUserV5Balances) refetchUserV5Balances()
    if (isFetchedUserV4Balances && !isFetchingUserV4Balances) refetchUserV4Balances()
    if (isFetchedUserV3Balances && !isFetchingUserV3Balances) refetchUserV3Balances()
    if (isFetchedUserV5Rewards && !isFetchingUserV5Rewards) refetchUserV5Rewards()
    if (isFetchedUserV4Rewards && !isFetchingUserV4Rewards) refetchUserV4Rewards()
  }, [])

  return (
    <div className={classNames('w-full flex flex-col gap-8 items-center', className)}>
      {!isFetched && <Spinner />}
      {isFetched && !isEmpty && (
        <>
          {(!!userV5Balances.length || !!userV5Rewards.length) && (
            <V5Migrations userAddress={userAddress} showPooly={true} />
          )}
          {(!!userV4Balances.length || !!userV4Rewards.length) && (
            <V4Migrations userAddress={userAddress} showPooly={!userV5Balances.length} />
          )}
          {!!userV3Balances.length && (
            <V3Migrations userAddress={userAddress} showPooly={!userV4Balances.length} />
          )}
        </>
      )}
      {isFetched && isEmpty && <NoMigrationsAvailable />}
    </div>
  )
}

const NoMigrationsAvailable = () => {
  return (
    <div className='w-full p-4 bg-pt-bg-purple-dark rounded-t-2xl rounded-b-[2.5rem]'>
      <div className='w-full flex flex-col gap-6 items-center px-4 py-16 bg-pt-transparent rounded-3xl'>
        <Image src='/pooly.svg' alt='Pooly' height={64} width={72} className='h-16 w-auto' />
        <div className='flex flex-col gap-1 text-center'>
          <span className='text-3xl'>You're all set!</span>
          <span className='text-sm'>
            We couldn't find any prize tokens in your wallet that need migrating.
          </span>
        </div>
      </div>
    </div>
  )
}
