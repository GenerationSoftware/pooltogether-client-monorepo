import { useToken } from '@generationsoftware/hyperstructure-react-hooks'
import { TokenValueAndAmount } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import { useUserClaimablePromotions } from '@hooks/useUserClaimablePromotions'
import { useUserClaimedPromotions } from '@hooks/useUserClaimedPromotions'

interface AccountPromotionsRewardsEarnedProps {
  chainId: number
  promotionId: bigint
  address?: Address
  className?: string
}

export const AccountPromotionsRewardsEarned = (props: AccountPromotionsRewardsEarnedProps) => {
  const { chainId, promotionId, address, className } = props

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

  const tokenAddress = claimed?.token ?? claimable?.token

  const { data: tokenData } = useToken(chainId, tokenAddress as Address)

  if ((!claimed && !claimable) || !tokenAddress || !tokenData) {
    return <Spinner />
  }

  const claimedRewards = claimed?.totalClaimed ?? 0n
  const claimableRewards = !!claimable
    ? Object.values(claimable.epochRewards).reduce((a, b) => a + b, 0n)
    : 0n

  const amount = claimedRewards + claimableRewards
  const shiftedAmount = parseFloat(formatUnits(amount, tokenData.decimals))

  return (
    <TokenValueAndAmount
      token={{ chainId, address: tokenAddress, amount }}
      className={className}
      valueClassName='text-sm md:text-base'
      amountClassName='text-xs md:text-sm'
      valueOptions={{ hideZeroes: true }}
      amountOptions={shiftedAmount > 1e3 ? { hideZeroes: true } : { maximumFractionDigits: 2 }}
    />
  )
}
