import { TokenAmount } from '@shared/react-components'
import { Button } from '@shared/ui'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useUserClaimablePromotions } from '@hooks/useUserClaimablePromotions'

interface AccountPromotionsClaimActionsProps {
  chainId: number
  promotionId: bigint
  address?: Address
  fullSized?: boolean
  className?: string
}

export const AccountPromotionsClaimActions = (props: AccountPromotionsClaimActionsProps) => {
  const { chainId, promotionId, address, fullSized, className } = props

  const t = useTranslations('Common')

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const { data: allClaimable } = useUserClaimablePromotions(userAddress as Address)

  const claimable = useMemo(() => {
    return allClaimable.find(
      (promotion) => promotion.chainId === chainId && promotion.promotionId === promotionId
    )
  }, [allClaimable])

  if (!!claimable) {
    const claimableAmount = Object.values(claimable.epochRewards).reduce((a, b) => a + b, 0n)

    // TODO: add functionality (use `TransactionButton`)
    // TODO: display warning to claim soon if promotion has ended
    return (
      <Button fullSized={fullSized} className={className}>
        {t('claim')}{' '}
        <TokenAmount token={{ chainId, address: claimable.token, amount: claimableAmount }} />
      </Button>
    )
  }

  return <></>
}
