import { useSendClaimRewardsTransaction } from '@generationsoftware/hyperstructure-react-hooks'
import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { CurrencyValue, TransactionButton } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { getNiceNetworkNameByChainId } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useNetworks } from '@hooks/useNetworks'
import { useUserClaimablePromotions } from '@hooks/useUserClaimablePromotions'
import { useUserClaimedPromotions } from '@hooks/useUserClaimedPromotions'
import { useUserTotalPromotionRewards } from '@hooks/useUserTotalPromotionRewards'

interface AccountPromotionsHeaderProps {
  address?: Address
  className?: string
}

export const AccountPromotionsHeader = (props: AccountPromotionsHeaderProps) => {
  const { address, className } = props

  const t = useTranslations('Common')

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const networks = useNetworks()

  const isExternalUser = useMemo(() => {
    return !!address && address.toLowerCase() !== _userAddress?.toLowerCase()
  }, [address, _userAddress])

  const { data: totalRewards } = useUserTotalPromotionRewards(userAddress as Address, {
    includeUnclaimed: true
  })

  return (
    <div className={classNames('flex flex-col items-center gap-1 md:gap-2', className)}>
      <span className='text-sm text-pt-purple-100 md:text-base'>{t('bonusRewards')}</span>
      <span className='text-[1.75rem] font-grotesk font-medium md:text-4xl'>
        {!!userAddress && totalRewards !== undefined ? (
          <CurrencyValue baseValue={totalRewards} countUp={true} fallback={<Spinner />} />
        ) : (
          <Spinner />
        )}
      </span>
      {!!userAddress && !isExternalUser && (
        <div className='flex flex-col gap-2 items-center mt-1'>
          {networks.map((network) => (
            <ClaimAllRewardsButton
              key={`claimAllButton-${network}`}
              chainId={network}
              userAddress={userAddress}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// TODO: the "claim all" button should ideally encompass the pool-wide TWAB promotions as well
// use `claimRewards`, `claimTwabRewards` and `multicall` pass-through on pool-wide twab rewards contract to claim any number of promotions from any contract

interface ClaimAllRewardsButtonProps {
  chainId: number
  userAddress: Address
  className?: string
}

const ClaimAllRewardsButton = (props: ClaimAllRewardsButtonProps) => {
  const { chainId, userAddress, className } = props

  const t_common = useTranslations('Common')
  const t_account = useTranslations('Account')
  const t_txs = useTranslations('TxModals')

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

  const { refetch: refetchAllClaimed } = useUserClaimedPromotions(userAddress)
  const {
    data: allClaimable,
    isFetched: isFetchedAllClaimable,
    refetch: refetchAllClaimable
  } = useUserClaimablePromotions(userAddress)

  const claimablePromotions = useMemo(() => {
    return allClaimable.filter((promotion) => promotion.chainId === chainId)
  }, [allClaimable])

  const epochsToClaim = useMemo(() => {
    const epochs: { [id: string]: number[] } = {}

    if (isFetchedAllClaimable && claimablePromotions.length > 0) {
      claimablePromotions.forEach((promotion) => {
        const epochIds = Object.keys(promotion.epochRewards).map((k) => parseInt(k))

        if (!!epochIds.length) {
          epochs[promotion.promotionId.toString()] = epochIds
        }
      })
    }

    return epochs
  }, [claimablePromotions, isFetchedAllClaimable])

  const { isWaiting, isConfirming, isSuccess, txHash, sendClaimRewardsTransaction } =
    useSendClaimRewardsTransaction(chainId, userAddress, epochsToClaim, {
      onSuccess: () => {
        refetchAllClaimed()
        refetchAllClaimable()
      }
    })

  if (Object.keys(epochsToClaim).length > 1) {
    const network = getNiceNetworkNameByChainId(chainId)

    return (
      <TransactionButton
        chainId={chainId}
        isTxLoading={isWaiting || isConfirming}
        isTxSuccess={isSuccess}
        write={sendClaimRewardsTransaction}
        txHash={txHash}
        txDescription={t_account('claimAllRewardsTx', { network })}
        openConnectModal={openConnectModal}
        openChainModal={openChainModal}
        addRecentTransaction={addRecentTransaction}
        intl={{ base: t_txs, common: t_common }}
        className={classNames('min-w-[6rem]', className)}
      >
        {t_account('claimAllOnNetwork', { network })}
      </TransactionButton>
    )
  }

  return <></>
}
