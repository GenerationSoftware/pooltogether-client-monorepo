import { useToken } from '@generationsoftware/hyperstructure-react-hooks'
import { TokenValueAndAmount } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { lower } from '@shared/utilities'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import { useUserClaimablePoolWidePromotions } from '@hooks/useUserClaimablePoolWidePromotions'
import { useUserClaimablePromotions } from '@hooks/useUserClaimablePromotions'

interface AccountPromotionClaimableRewardsProps {
  chainId: number
  promotionId: bigint
  userAddress?: Address
  vaultAddress?: Address
  isPoolWide?: boolean
  className?: string
}

export const AccountPromotionClaimableRewards = (props: AccountPromotionClaimableRewardsProps) => {
  const { chainId, promotionId, userAddress, vaultAddress, isPoolWide, className } = props

  const { address: _userAddress } = useAccount()

  const { data: allClaimable, isFetched: isFetchedAllClaimable } = useUserClaimablePromotions(
    (userAddress ?? _userAddress)!
  )

  const { data: allPoolWideClaimable, isFetched: isFetchedAllPoolWideClaimable } =
    useUserClaimablePoolWidePromotions((userAddress ?? _userAddress)!)

  const claimable = useMemo(() => {
    return (isPoolWide ? allPoolWideClaimable : allClaimable).find(
      (promotion) =>
        promotion.chainId === chainId &&
        promotion.promotionId === promotionId &&
        (!vaultAddress || lower(promotion.vault) === lower(vaultAddress))
    )
  }, [isPoolWide, allClaimable, allPoolWideClaimable, chainId, promotionId, vaultAddress])

  const { data: tokenData } = useToken(chainId, claimable?.token!)

  const isFetchedClaimableData = isPoolWide
    ? allPoolWideClaimable.some((p) => p.chainId === chainId) ?? isFetchedAllPoolWideClaimable
    : allClaimable.some((p) => p.chainId === chainId) ?? isFetchedAllClaimable

  if (!isFetchedClaimableData || (!!claimable && !tokenData)) {
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
