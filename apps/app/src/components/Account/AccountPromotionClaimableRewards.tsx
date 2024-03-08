import { useToken } from '@generationsoftware/hyperstructure-react-hooks'
import { TokenValueAndAmount } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import { useUserClaimablePromotions } from '@hooks/useUserClaimablePromotions'

interface AccountPromotionClaimableRewardsProps {
  chainId: number
  promotionId: bigint
  address?: Address
  className?: string
}

export const AccountPromotionClaimableRewards = (props: AccountPromotionClaimableRewardsProps) => {
  const { chainId, promotionId, address, className } = props

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const { data: allClaimable, isFetched: isFetchedAllClaimable } = useUserClaimablePromotions(
    userAddress as Address
  )

  const claimable = useMemo(() => {
    return allClaimable.find(
      (promotion) => promotion.chainId === chainId && promotion.promotionId === promotionId
    )
  }, [allClaimable])

  const { data: tokenData } = useToken(chainId, claimable?.token as Address)

  if (!isFetchedAllClaimable || (!!claimable && !tokenData)) {
    return <Spinner />
  }

  if (!claimable || !tokenData) {
    return <>-</>
  }

  const amount = Object.values(claimable.epochRewards).reduce((a, b) => a + b, 0n)
  const shiftedAmount = parseFloat(formatUnits(amount, tokenData.decimals))

  return (
    <TokenValueAndAmount
      token={{ chainId, address: claimable.token, amount }}
      className={className}
      valueClassName='text-sm md:text-base'
      amountClassName='text-xs md:text-sm'
      valueOptions={{ hideZeroes: true }}
      amountOptions={shiftedAmount > 1e3 ? { hideZeroes: true } : { maximumFractionDigits: 2 }}
    />
  )
}
