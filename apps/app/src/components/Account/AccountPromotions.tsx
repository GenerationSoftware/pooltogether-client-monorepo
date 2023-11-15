import classNames from 'classnames'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useUserClaimablePromotions } from '@hooks/useUserClaimablePromotions'
import { useUserClaimedPromotions } from '@hooks/useUserClaimedPromotions'
import { AccountPromotionsCards } from './AccountPromotionsCards'
import { AccountPromotionsHeader } from './AccountPromotionsHeader'
import { AccountPromotionsTable } from './AccountPromotionsTable'

interface AccountPromotionsProps {
  address?: Address
  className?: string
}

export const AccountPromotions = (props: AccountPromotionsProps) => {
  const { address, className } = props

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const { data: claimed } = useUserClaimedPromotions(userAddress as Address)
  const { data: claimable } = useUserClaimablePromotions(userAddress as Address)

  const isNotEmpty = !!claimable.length || !!claimed.length

  if (typeof window !== 'undefined' && !!userAddress && isNotEmpty) {
    return (
      <div
        className={classNames(
          'w-full max-w-xl flex flex-col items-center lg:max-w-none',
          className
        )}
      >
        <AccountPromotionsHeader address={userAddress} />
        <AccountPromotionsTable address={userAddress} className='hidden mt-8 lg:block' />
        <AccountPromotionsCards address={userAddress} className='mt-2 md:mt-4 lg:hidden' />
      </div>
    )
  }

  return <></>
}
