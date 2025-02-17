import { useToken } from '@generationsoftware/hyperstructure-react-hooks'
import { TokenValueAndAmount } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { lower } from '@shared/utilities'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import { useUserClaimedPoolWidePromotions } from '@hooks/useUserClaimedPoolWidePromotions'
import { useUserClaimedPromotions } from '@hooks/useUserClaimedPromotions'

interface AccountPromotionClaimedRewardsProps {
  chainId: number
  promotionId: bigint
  userAddress?: Address
  vaultAddress?: Address
  isPoolWide?: boolean
  className?: string
}

export const AccountPromotionClaimedRewards = (props: AccountPromotionClaimedRewardsProps) => {
  const { chainId, promotionId, userAddress, vaultAddress, isPoolWide, className } = props

  const { address: _userAddress } = useAccount()

  const { data: allClaimed, isFetched: isFetchedAllClaimed } = useUserClaimedPromotions(
    (userAddress ?? _userAddress)!
  )

  const { data: allPoolWideClaimed, isFetched: isFetchedAllPoolWideClaimed } =
    useUserClaimedPoolWidePromotions((userAddress ?? _userAddress)!)

  const claimed = useMemo(() => {
    return (isPoolWide ? allPoolWideClaimed : allClaimed).find(
      (promotion) =>
        promotion.chainId === chainId &&
        promotion.promotionId === promotionId &&
        (!vaultAddress || lower(promotion.vault) === lower(vaultAddress))
    )
  }, [isPoolWide, allClaimed, allPoolWideClaimed, chainId, promotionId, vaultAddress])

  const { data: tokenData } = useToken(chainId, claimed?.token!)

  if (!isFetchedAllClaimed || !isFetchedAllPoolWideClaimed || (!!claimed && !tokenData)) {
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
