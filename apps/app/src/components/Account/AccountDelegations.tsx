import { useAllUserVaultDelegationBalances } from '@generationsoftware/hyperstructure-react-hooks'
import classNames from 'classnames'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'
import { AccountDelegationsCards } from './AccountDelegationsCards'
import { AccountDelegationsHeader } from './AccountDelegationsHeader'
import { AccountDelegationsTable } from './AccountDelegationsTable'

interface AccountDelegationsProps {
  address?: Address
  className?: string
}

export const AccountDelegations = (props: AccountDelegationsProps) => {
  const { address, className } = props

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const { data: delegationBalances, isFetched: isFetchedDelegationBalances } =
    useAllUserVaultDelegationBalances(prizePoolsArray, userAddress as Address)

  const isNotEmpty = !!delegationBalances && Object.keys(delegationBalances).length > 0

  if (
    typeof window !== undefined &&
    !!userAddress &&
    isFetchedDelegationBalances &&
    !!delegationBalances &&
    isNotEmpty
  ) {
    return (
      <div
        className={classNames(
          'w-full max-w-xl flex flex-col gap-2 items-center md:gap-4 lg:max-w-none',
          className
        )}
      >
        <AccountDelegationsHeader address={userAddress} />
        <AccountDelegationsTable
          address={userAddress}
          rounded={true}
          className='hidden mt-4 lg:block'
        />
        <AccountDelegationsCards address={userAddress} className='lg:hidden' />
      </div>
    )
  }

  return <></>
}
