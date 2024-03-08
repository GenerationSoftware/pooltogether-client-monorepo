import { useToken } from '@generationsoftware/hyperstructure-react-hooks'
import { TokenValueAndAmount } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import { useUserClaimedPromotions } from '@hooks/useUserClaimedPromotions'

interface AccountPromotionClaimedRewardsProps {
  chainId: number
  promotionId: bigint
  address?: Address
  className?: string
}

export const AccountPromotionClaimedRewards = (props: AccountPromotionClaimedRewardsProps) => {
  const { chainId, promotionId, address, className } = props

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const { data: allClaimed, isFetched: isFetchedAllClaimed } = useUserClaimedPromotions(
    userAddress as Address
  )

  const claimed = useMemo(() => {
    return allClaimed.find(
      (promotion) => promotion.chainId === chainId && promotion.promotionId === promotionId
    )
  }, [allClaimed])

  const { data: tokenData } = useToken(chainId, claimed?.token as Address)

  if (!isFetchedAllClaimed || (!!claimed && !tokenData)) {
    return <Spinner />
  }

  if (!claimed || !tokenData) {
    return <>-</>
  }

  const amount = claimed.totalClaimed
  const shiftedAmount = parseFloat(formatUnits(amount, tokenData.decimals))

  return (
    <TokenValueAndAmount
      token={{ chainId, address: claimed.token, amount }}
      className={className}
      valueClassName='text-sm md:text-base'
      amountClassName='text-xs md:text-sm'
      valueOptions={{ hideZeroes: true }}
      amountOptions={shiftedAmount > 1e3 ? { hideZeroes: true } : { maximumFractionDigits: 2 }}
    />
  )
}
