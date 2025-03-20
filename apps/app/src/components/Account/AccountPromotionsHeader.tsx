import {
  useSendAggregateClaimRewardsTransaction,
  useSendClaimRewardsTransaction,
  useSendPoolWideClaimRewardsTransaction
} from '@generationsoftware/hyperstructure-react-hooks'
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
import { useUserClaimablePoolWidePromotions } from '@hooks/useUserClaimablePoolWidePromotions'
import { useUserClaimablePromotions } from '@hooks/useUserClaimablePromotions'
import { useUserClaimedPoolWidePromotions } from '@hooks/useUserClaimedPoolWidePromotions'
import { useUserClaimedPromotions } from '@hooks/useUserClaimedPromotions'
import { useUserTotalPromotionRewards } from '@hooks/useUserTotalPromotionRewards'

interface AccountPromotionsHeaderProps {
  userAddress?: Address
  className?: string
}

export const AccountPromotionsHeader = (props: AccountPromotionsHeaderProps) => {
  const { userAddress, className } = props

  const t = useTranslations('Common')

  const { address: _userAddress } = useAccount()

  const networks = useNetworks()

  const isExternalUser = useMemo(() => {
    return !!userAddress && userAddress.toLowerCase() !== _userAddress?.toLowerCase()
  }, [userAddress, _userAddress])

  const { data: totalRewards } = useUserTotalPromotionRewards((userAddress ?? _userAddress)!, {
    includeUnclaimed: true
  })

  return (
    <div className={classNames('flex flex-col items-center gap-1 md:gap-2', className)}>
      <span className='text-sm text-pt-purple-100 md:text-base'>{t('bonusRewards')}</span>
      <span className='text-[1.75rem] font-grotesk font-medium md:text-4xl'>
        {!!(userAddress ?? _userAddress) && totalRewards !== undefined ? (
          <CurrencyValue baseValue={totalRewards} countUp={true} fallback={<Spinner />} />
        ) : (
          <Spinner />
        )}
      </span>
      {!!(userAddress ?? _userAddress) && !isExternalUser && (
        <div className='flex flex-col gap-2 items-center mt-1'>
          {networks.map((network) => (
            <ClaimAllRewardsButton
              key={`claimAllButton-${network}`}
              chainId={network}
              userAddress={(userAddress ?? _userAddress)!}
            />
          ))}
        </div>
      )}
    </div>
  )
}

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

  const { refetch: refetchAllPoolWideClaimed } = useUserClaimedPoolWidePromotions(userAddress)
  const {
    data: allPoolWideClaimable,
    isFetched: isFetchedAllPoolWideClaimable,
    refetch: refetchAllPoolWideClaimable
  } = useUserClaimablePoolWidePromotions(userAddress)

  const claimablePromotions = useMemo(() => {
    return allClaimable.filter((promotion) => promotion.chainId === chainId)
  }, [allClaimable])

  const claimablePoolWidePromotions = useMemo(() => {
    return allPoolWideClaimable.filter((promotion) => promotion.chainId === chainId)
  }, [allPoolWideClaimable])

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

  const poolWidePromotionsToClaim = useMemo(() => {
    const promotions: { id: string; vaultAddress: Address; epochs: number[] }[] = []

    if (isFetchedAllPoolWideClaimable && claimablePoolWidePromotions.length > 0) {
      claimablePoolWidePromotions.forEach((promotion) => {
        const epochIds = Object.keys(promotion.epochRewards).map((k) => parseInt(k))

        if (!!epochIds.length) {
          promotions.push({
            id: promotion.promotionId.toString(),
            vaultAddress: promotion.vault,
            epochs: epochIds
          })
        }
      })
    }

    return promotions
  }, [claimablePoolWidePromotions, isFetchedAllPoolWideClaimable])

  const {
    isWaiting: isWaitingClaimRewards,
    isConfirming: isConfirmingClaimRewards,
    isSuccess: isSuccessClaimRewards,
    txHash: txHashClaimRewards,
    sendClaimRewardsTransaction
  } = useSendClaimRewardsTransaction(chainId, userAddress, epochsToClaim, {
    onSuccess: () => {
      refetchAllClaimed()
      refetchAllClaimable()
    }
  })

  const {
    isWaiting: isWaitingClaimPoolWideRewards,
    isConfirming: isConfirmingClaimPoolWideRewards,
    isSuccess: isSuccessClaimPoolWideRewards,
    txHash: txHashClaimPoolWideRewards,
    sendPoolWideClaimRewardsTransaction
  } = useSendPoolWideClaimRewardsTransaction(chainId, userAddress, poolWidePromotionsToClaim, {
    onSuccess: () => {
      refetchAllPoolWideClaimed()
      refetchAllPoolWideClaimable()
    }
  })

  const {
    isWaiting: isWaitingAggregateClaimRewards,
    isConfirming: isConfirmingAggregateClaimRewards,
    isSuccess: isSuccessAggregateClaimRewards,
    txHash: txHashAggregateClaimRewards,
    sendAggregateClaimRewardsTransaction
  } = useSendAggregateClaimRewardsTransaction(
    chainId,
    userAddress,
    epochsToClaim,
    poolWidePromotionsToClaim,
    {
      onSuccess: () => {
        refetchAllClaimed()
        refetchAllClaimable()
        refetchAllPoolWideClaimed()
        refetchAllPoolWideClaimable()
      }
    }
  )

  if (Object.keys(epochsToClaim).length + poolWidePromotionsToClaim.length > 1) {
    const network = getNiceNetworkNameByChainId(chainId)

    const isEnabled = !!Object.keys(epochsToClaim).length
    const isEnabledPoolWide = !!poolWidePromotionsToClaim.length
    const isEnabledAggregate = isEnabled && isEnabledPoolWide

    const isWaiting = isEnabledAggregate
      ? isWaitingAggregateClaimRewards
      : isEnabledPoolWide
      ? isWaitingClaimPoolWideRewards
      : isWaitingClaimRewards
    const isConfirming = isEnabledAggregate
      ? isConfirmingAggregateClaimRewards
      : isEnabledPoolWide
      ? isConfirmingClaimPoolWideRewards
      : isConfirmingClaimRewards
    const isSuccess = isEnabledAggregate
      ? isSuccessAggregateClaimRewards
      : isEnabledPoolWide
      ? isSuccessClaimPoolWideRewards
      : isSuccessClaimRewards
    const txHash = isEnabledAggregate
      ? txHashAggregateClaimRewards
      : isEnabledPoolWide
      ? txHashClaimPoolWideRewards
      : txHashClaimRewards
    const sendTx = isEnabledAggregate
      ? sendAggregateClaimRewardsTransaction
      : isEnabledPoolWide
      ? sendPoolWideClaimRewardsTransaction
      : sendClaimRewardsTransaction

    return (
      <TransactionButton
        chainId={chainId}
        isTxLoading={isWaiting || isConfirming}
        isTxSuccess={isSuccess}
        write={sendTx}
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
