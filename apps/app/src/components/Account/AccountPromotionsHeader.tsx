import {
  useSend5792AggregateClaimRewardsTransaction,
  useSend5792ClaimRewardsTransaction,
  useSend5792PoolWideClaimRewardsTransaction,
  useSendAggregateClaimRewardsTransaction,
  useSendClaimRewardsTransaction,
  useSendPoolWideClaimRewardsTransaction
} from '@generationsoftware/hyperstructure-react-hooks'
import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { useMiscSettings } from '@shared/generic-react-hooks'
import { CurrencyValue, TransactionButton } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { getNiceNetworkNameByChainId, supportsEip5792, supportsEip7677 } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount, useCapabilities } from 'wagmi'
import { PAYMASTER_URLS } from '@constants/config'
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

  const { data: totalRewards, isFetched: isFetchedTotalRewards } = useUserTotalPromotionRewards(
    (userAddress ?? _userAddress)!,
    { includeUnclaimed: true }
  )

  return (
    <div className={classNames('flex flex-col items-center gap-1 md:gap-2', className)}>
      <span className='text-sm text-pt-purple-100 md:text-base'>{t('bonusRewards')}</span>
      <span className='text-[1.75rem] font-grotesk font-medium md:text-4xl'>
        {!!(userAddress ?? _userAddress) && totalRewards !== undefined && (
          <CurrencyValue baseValue={totalRewards} countUp={true} fallback={<Spinner />} />
        )}
        {totalRewards !== undefined && !isFetchedTotalRewards && (
          <>
            {' '}
            <Spinner />
          </>
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
  const { data: allClaimable, refetch: refetchAllClaimable } =
    useUserClaimablePromotions(userAddress)

  const { refetch: refetchAllPoolWideClaimed } = useUserClaimedPoolWidePromotions(userAddress)
  const { data: allPoolWideClaimable, refetch: refetchAllPoolWideClaimable } =
    useUserClaimablePoolWidePromotions(userAddress)

  const claimablePromotions = useMemo(() => {
    return allClaimable.filter((promotion) => promotion.chainId === chainId)
  }, [allClaimable])

  const claimablePoolWidePromotions = useMemo(() => {
    return allPoolWideClaimable.filter((promotion) => promotion.chainId === chainId)
  }, [allPoolWideClaimable])

  const epochsToClaim = useMemo(() => {
    const epochs: { [id: string]: number[] } = {}

    if (claimablePromotions.length > 0) {
      claimablePromotions.forEach((promotion) => {
        const epochIds = Object.keys(promotion.epochRewards).map((k) => parseInt(k))

        if (!!epochIds.length) {
          epochs[promotion.promotionId.toString()] = epochIds
        }
      })
    }

    return epochs
  }, [claimablePromotions])

  const poolWidePromotionsToClaim = useMemo(() => {
    const promotions: { id: string; vaultAddress: Address; epochs: number[] }[] = []

    if (claimablePoolWidePromotions.length > 0) {
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
  }, [claimablePoolWidePromotions])

  const dataClaimRewardsTx = useSendClaimRewardsTransaction(chainId, userAddress, epochsToClaim, {
    onSuccess: () => {
      refetchAllClaimed()
      refetchAllClaimable()
    }
  })

  const dataPoolWideClaimRewardsTx = useSendPoolWideClaimRewardsTransaction(
    chainId,
    userAddress,
    poolWidePromotionsToClaim,
    {
      onSuccess: () => {
        refetchAllPoolWideClaimed()
        refetchAllPoolWideClaimable()
      }
    }
  )

  const dataAggregateClaimRewardsTx = useSendAggregateClaimRewardsTransaction(
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

  const { data: walletCapabilities } = useCapabilities()
  const chainWalletCapabilities = walletCapabilities?.[chainId] ?? {}

  const { isActive: isEip5792Disabled } = useMiscSettings('eip5792Disabled')
  const isUsingEip5792 = supportsEip5792(chainWalletCapabilities) && !isEip5792Disabled

  const { isActive: isEip7677Disabled } = useMiscSettings('eip7677Disabled')
  const paymasterUrl = PAYMASTER_URLS[chainId]
  const isUsingEip7677 =
    !!paymasterUrl && supportsEip7677(chainWalletCapabilities) && !isEip7677Disabled

  const data5792ClaimRewardsTx = useSend5792ClaimRewardsTransaction(
    chainId,
    userAddress,
    epochsToClaim,
    {
      paymasterService: isUsingEip7677 ? { url: paymasterUrl, optional: true } : undefined,
      onSuccess: () => {
        refetchAllClaimed()
        refetchAllClaimable()
      },
      enabled: isUsingEip5792
    }
  )

  const data5792PoolWideClaimRewardsTx = useSend5792PoolWideClaimRewardsTransaction(
    chainId,
    userAddress,
    poolWidePromotionsToClaim,
    {
      paymasterService: isUsingEip7677 ? { url: paymasterUrl, optional: true } : undefined,
      onSuccess: () => {
        refetchAllPoolWideClaimed()
        refetchAllPoolWideClaimable()
      },
      enabled: isUsingEip5792
    }
  )

  const data5792AggregateClaimRewardsTx = useSend5792AggregateClaimRewardsTransaction(
    chainId,
    userAddress,
    epochsToClaim,
    poolWidePromotionsToClaim,
    {
      paymasterService: isUsingEip7677 ? { url: paymasterUrl, optional: true } : undefined,
      onSuccess: () => {
        refetchAllClaimed()
        refetchAllClaimable()
        refetchAllPoolWideClaimed()
        refetchAllPoolWideClaimable()
      },
      enabled: isUsingEip5792
    }
  )

  if (Object.keys(epochsToClaim).length + poolWidePromotionsToClaim.length > 1) {
    const network = getNiceNetworkNameByChainId(chainId)

    const isEnabled = !!Object.keys(epochsToClaim).length
    const isEnabledPoolWide = !!poolWidePromotionsToClaim.length
    const isEnabledAggregate = isEnabled && isEnabledPoolWide

    const { isWaiting, isConfirming, isSuccess } = isEnabledAggregate
      ? isUsingEip5792
        ? data5792AggregateClaimRewardsTx
        : dataAggregateClaimRewardsTx
      : isEnabledPoolWide
      ? isUsingEip5792
        ? data5792PoolWideClaimRewardsTx
        : dataPoolWideClaimRewardsTx
      : isUsingEip5792
      ? data5792ClaimRewardsTx
      : dataClaimRewardsTx
    const txHash = isEnabledAggregate
      ? isUsingEip5792
        ? data5792AggregateClaimRewardsTx.txHashes?.at(-1)
        : dataAggregateClaimRewardsTx.txHash
      : isEnabledPoolWide
      ? isUsingEip5792
        ? data5792PoolWideClaimRewardsTx.txHashes?.at(-1)
        : dataPoolWideClaimRewardsTx.txHash
      : isUsingEip5792
      ? data5792ClaimRewardsTx.txHashes?.at(-1)
      : dataClaimRewardsTx.txHash
    const sendTx = isEnabledAggregate
      ? isUsingEip5792
        ? data5792AggregateClaimRewardsTx.send5792AggregateClaimRewardsTransaction
        : dataAggregateClaimRewardsTx.sendAggregateClaimRewardsTransaction
      : isEnabledPoolWide
      ? isUsingEip5792
        ? data5792PoolWideClaimRewardsTx.send5792PoolWideClaimRewardsTransaction
        : dataPoolWideClaimRewardsTx.sendPoolWideClaimRewardsTransaction
      : isUsingEip5792
      ? data5792ClaimRewardsTx.send5792ClaimRewardsTransaction
      : dataClaimRewardsTx.sendClaimRewardsTransaction

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
