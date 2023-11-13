import classNames from 'classnames'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useUserClaimablePromotions } from '@hooks/useUserClaimablePromotions'
import { useUserClaimedPromotions } from '@hooks/useUserClaimedPromotions'

interface AccountPromotionsProps {
  address?: Address
  className?: string
}

export const AccountPromotions = (props: AccountPromotionsProps) => {
  const { address, className } = props

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const { data: claimable } = useUserClaimablePromotions(userAddress as Address)

  const { data: claimed } = useUserClaimedPromotions(userAddress as Address)

  const isNotEmpty = !!claimable.length || !!claimed.length

  if (typeof window !== 'undefined' && !!userAddress && isNotEmpty) {
    return (
      <div
        className={classNames(
          'w-full max-w-xl flex flex-col items-center lg:max-w-none',
          className
        )}
      >
        {/* TODO: implement these components */}
        {/* <AccountPromotionsHeader address={userAddress} /> */}
        {/* <AccountPromotionsTable claimable={claimable} claimed={claimed} className='hidden mt-8 lg:block' /> */}
        {/* <AccountPromotionsCards claimable={claimable} claimed={claimed} className='mt-2 md:mt-4 lg:hidden' /> */}
      </div>
    )
  }

  return <></>
}
