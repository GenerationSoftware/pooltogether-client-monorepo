import { TokenValueAndAmount } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useUserClaimablePromotions } from '@hooks/useUserClaimablePromotions'
import { useUserClaimedPromotions } from '@hooks/useUserClaimedPromotions'

interface AccountPromotionsRewardsEarnedProps {
  chainId: number
  promotionId: bigint
  address?: Address
  className?: string
  valueClassName?: string
  amountClassName?: string
}

export const AccountPromotionsRewardsEarned = (props: AccountPromotionsRewardsEarnedProps) => {
  const { chainId, promotionId, address, className, valueClassName, amountClassName } = props

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const { data: allClaimed } = useUserClaimedPromotions(userAddress as Address)
  const { data: allClaimable } = useUserClaimablePromotions(userAddress as Address)

  const claimed = useMemo(() => {
    return allClaimed.find(
      (promotion) => promotion.chainId === chainId && promotion.promotionId === promotionId
    )
  }, [allClaimed])

  const claimable = useMemo(() => {
    return allClaimable.find(
      (promotion) => promotion.chainId === chainId && promotion.promotionId === promotionId
    )
  }, [allClaimable])

  if (!claimed && !claimable) {
    return <Spinner />
  }

  const tokenAddress = (claimed?.token ?? claimable?.token) as Address
  const claimedRewards = claimed?.totalClaimed ?? 0n
  const claimableRewards = !!claimable
    ? Object.values(claimable.epochRewards).reduce((a, b) => a + b, 0n)
    : 0n

  return (
    <TokenValueAndAmount
      token={{ chainId, address: tokenAddress, amount: claimedRewards + claimableRewards }}
      className={className}
      valueClassName={valueClassName}
      amountClassName={amountClassName}
    />
  )
}
