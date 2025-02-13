import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { usePublicClientsByChain } from '@generationsoftware/hyperstructure-react-hooks'
import { VaultBadge } from '@shared/react-components'
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
  address?: Address
  isPoolWide?: boolean
}

export const AccountPromotionCard = (props: AccountPromotionCardProps) => {
  const { chainId, promotionId, address, isPoolWide } = props

  const t = useTranslations('Account.bonusRewardHeaders')

  const publicClients = usePublicClientsByChain()

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const isExternalUser = useMemo(() => {
    return !!address && address.toLowerCase() !== _userAddress?.toLowerCase()
  }, [address, _userAddress])

  const { data: allClaimed } = useUserClaimedPromotions(userAddress!)
  const { data: allClaimable } = useUserClaimablePromotions(userAddress!)

  const { data: allPoolWideClaimed } = useUserClaimedPoolWidePromotions(userAddress!)
  const { data: allPoolWideClaimable } = useUserClaimablePoolWidePromotions(userAddress!)

  const claimed = useMemo(() => {
    return (isPoolWide ? allPoolWideClaimed : allClaimed).find(
      (promotion) => promotion.chainId === chainId && promotion.promotionId === promotionId
    )
  }, [allClaimed])

  const claimable = useMemo(() => {
    return (isPoolWide ? allPoolWideClaimable : allClaimable).find(
      (promotion) => promotion.chainId === chainId && promotion.promotionId === promotionId
    )
  }, [allClaimable])

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
                address={userAddress}
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
                address={userAddress}
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
            address={userAddress}
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
