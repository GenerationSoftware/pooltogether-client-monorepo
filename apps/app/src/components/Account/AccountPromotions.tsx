import classNames from 'classnames'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useUserClaimablePoolWidePromotions } from '@hooks/useUserClaimablePoolWidePromotions'
import { useUserClaimablePromotions } from '@hooks/useUserClaimablePromotions'
import { useUserClaimedPoolWidePromotions } from '@hooks/useUserClaimedPoolWidePromotions'
import { useUserClaimedPromotions } from '@hooks/useUserClaimedPromotions'
import { AccountPromotionCards } from './AccountPromotionCards'
import { AccountPromotionsHeader } from './AccountPromotionsHeader'
import { AccountPromotionsTable } from './AccountPromotionsTable'

interface AccountPromotionsProps {
  userAddress?: Address
  className?: string
}

export const AccountPromotions = (props: AccountPromotionsProps) => {
  const { userAddress, className } = props

  const { address: _userAddress } = useAccount()

  const { data: claimed } = useUserClaimedPromotions((userAddress ?? _userAddress)!)
  const { data: claimable } = useUserClaimablePromotions((userAddress ?? _userAddress)!)

  const { data: poolWideClaimed } = useUserClaimedPoolWidePromotions((userAddress ?? _userAddress)!)
  const { data: poolWideClaimable } = useUserClaimablePoolWidePromotions(
    (userAddress ?? _userAddress)!
  )

  const isNotEmpty =
    !!claimable.length || !!claimed.length || !!poolWideClaimed || !!poolWideClaimable

  if (typeof window !== 'undefined' && !!(userAddress ?? _userAddress) && isNotEmpty) {
    return (
      <div
        className={classNames(
          'w-full max-w-xl flex flex-col items-center lg:max-w-none',
          className
        )}
      >
        <AccountPromotionsHeader userAddress={userAddress} />
        <AccountPromotionsTable
          userAddress={userAddress ?? _userAddress}
          className='hidden mt-8 lg:block'
        />
        <AccountPromotionCards
          userAddress={userAddress ?? _userAddress}
          className='mt-4 lg:hidden'
        />
      </div>
    )
  }

  return <></>
}
