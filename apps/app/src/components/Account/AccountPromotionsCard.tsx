import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { usePublicClientsByChain } from '@generationsoftware/hyperstructure-react-hooks'
import { VaultBadge } from '@shared/react-components'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useUserClaimablePromotions } from '@hooks/useUserClaimablePromotions'
import { useUserClaimedPromotions } from '@hooks/useUserClaimedPromotions'
import { AccountPromotionsClaimActions } from './AccountPromotionsClaimActions'
import { AccountPromotionsRewardsEarned } from './AccountPromotionsRewardsEarned'
import { AccountPromotionsRewardToken } from './AccountPromotionsRewardToken'

interface AccountPromotionsCardProps {
  chainId: number
  promotionId: bigint
  address?: Address
}

export const AccountPromotionsCard = (props: AccountPromotionsCardProps) => {
  const { chainId, promotionId, address } = props

  const t = useTranslations('Account.bonusRewardHeaders')

  const publicClients = usePublicClientsByChain()

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const isExternalUser = useMemo(() => {
    return !!address && address.toLowerCase() !== _userAddress?.toLowerCase()
  }, [address, _userAddress])

  const { data: claimed } = useUserClaimedPromotions(userAddress as Address)
  const { data: claimable } = useUserClaimablePromotions(userAddress as Address)

  const promotionInfo = useMemo(() => {
    return (
      claimed.find(
        (promotion) => promotion.chainId === chainId && promotion.promotionId === promotionId
      ) ??
      claimable.find(
        (promotion) => promotion.chainId === chainId && promotion.promotionId === promotionId
      )
    )
  }, [claimed, claimable])

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
            <span className='text-xs text-pt-purple-200'>{t('rewardToken')}</span>
            <AccountPromotionsRewardToken chainId={chainId} tokenAddress={promotionInfo.token} />
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-xs text-pt-purple-200'>{t('rewardsEarned')}</span>
            <AccountPromotionsRewardsEarned
              chainId={chainId}
              promotionId={promotionId}
              address={userAddress}
            />
          </div>
        </div>
        {!isExternalUser && (
          <AccountPromotionsClaimActions
            chainId={chainId}
            promotionId={promotionId}
            address={userAddress}
            fullSized={true}
            className='w-full justify-center'
          />
        )}
      </div>
    )
  }

  return <></>
}
