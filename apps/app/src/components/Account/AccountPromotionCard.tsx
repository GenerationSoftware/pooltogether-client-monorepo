import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { usePublicClientsByChain } from '@generationsoftware/hyperstructure-react-hooks'
import { VaultBadge } from '@shared/react-components'
import { lower } from '@shared/utilities'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useUserClaimablePoolWidePromotions } from '@hooks/useUserClaimablePoolWidePromotions'
import { useUserClaimablePromotions } from '@hooks/useUserClaimablePromotions'
import { useUserClaimedPoolWidePromotions } from '@hooks/useUserClaimedPoolWidePromotions'
import { useUserClaimedPromotions } from '@hooks/useUserClaimedPromotions'
import { AccountPromotionClaimableRewards } from './AccountPromotionClaimableRewards'
import { AccountPromotionClaimActions } from './AccountPromotionClaimActions'
import { AccountPromotionClaimedRewards } from './AccountPromotionClaimedRewards'
import { AccountPromotionToken } from './AccountPromotionToken'

interface AccountPromotionCardProps {
  chainId: number
  promotionId: bigint
  userAddress?: Address
  vaultAddress?: Address
  isPoolWide?: boolean
}

export const AccountPromotionCard = (props: AccountPromotionCardProps) => {
  const { chainId, promotionId, userAddress, vaultAddress, isPoolWide } = props

  const t = useTranslations('Account.bonusRewardHeaders')

  const publicClients = usePublicClientsByChain()

  const { address: _userAddress } = useAccount()

  const isExternalUser = useMemo(() => {
    return !!userAddress && userAddress.toLowerCase() !== _userAddress?.toLowerCase()
  }, [userAddress, _userAddress])

  const { data: allClaimed } = useUserClaimedPromotions((userAddress ?? _userAddress)!)
  const { data: allClaimable } = useUserClaimablePromotions((userAddress ?? _userAddress)!)

  const { data: allPoolWideClaimed } = useUserClaimedPoolWidePromotions(
    (userAddress ?? _userAddress)!
  )
  const { data: allPoolWideClaimable } = useUserClaimablePoolWidePromotions(
    (userAddress ?? _userAddress)!
  )

  const claimed = useMemo(() => {
    return (isPoolWide ? allPoolWideClaimed : allClaimed).find(
      (promotion) =>
        promotion.chainId === chainId &&
        promotion.promotionId === promotionId &&
        (!vaultAddress || lower(promotion.vault) === lower(vaultAddress))
    )
  }, [isPoolWide, allClaimed, allPoolWideClaimed, chainId, promotionId, vaultAddress])

  const claimable = useMemo(() => {
    return (isPoolWide ? allPoolWideClaimable : allClaimable).find(
      (promotion) =>
        promotion.chainId === chainId &&
        promotion.promotionId === promotionId &&
        (!vaultAddress || lower(promotion.vault) === lower(vaultAddress))
    )
  }, [isPoolWide, allClaimable, allPoolWideClaimable, chainId, promotionId, vaultAddress])

  const promotionInfo = claimed ?? claimable

  if (!!promotionInfo) {
    const vault = new Vault(chainId, promotionInfo.vault, publicClients[chainId])

    return (
      <div className='flex flex-col gap-4 bg-pt-transparent rounded-lg px-3 pt-3 pb-6'>
        <div className='inline-flex gap-2 items-center'>
          <Link href={`/vault/${vault.chainId}/${vault.address}`}>
            <VaultBadge vault={vault} onClick={() => {}} />
          </Link>
        </div>
        <div className='w-full flex flex-col gap-1 px-3'>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-pt-purple-200'>{t('rewardToken')}</span>
            <AccountPromotionToken chainId={chainId} tokenAddress={promotionInfo.token} />
          </div>
          {!!claimed && (
            <div className='flex items-center justify-between'>
              <span className='text-sm text-pt-purple-200'>{t('rewardsClaimed')}</span>
              <AccountPromotionClaimedRewards
                chainId={chainId}
                promotionId={promotionId}
                userAddress={userAddress ?? _userAddress}
                vaultAddress={promotionInfo.vault}
                isPoolWide={isPoolWide}
                className='!flex-row gap-1'
              />
            </div>
          )}
          {!!claimable && (
            <div className='flex items-center justify-between'>
              <span className='text-sm text-pt-purple-200'>{t('rewardsClaimable')}</span>
              <AccountPromotionClaimableRewards
                chainId={chainId}
                promotionId={promotionId}
                userAddress={userAddress ?? _userAddress}
                vaultAddress={promotionInfo.vault}
                isPoolWide={isPoolWide}
                className='!flex-row gap-1'
              />
            </div>
          )}
        </div>
        {!isExternalUser && (
          <AccountPromotionClaimActions
            chainId={chainId}
            promotionId={promotionId}
            userAddress={userAddress ?? _userAddress}
            vaultAddress={promotionInfo.vault}
            isPoolWide={isPoolWide}
            fullSized={true}
            className='w-full justify-center'
          />
        )}
      </div>
    )
  }

  return <></>
}
