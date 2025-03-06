import {
  useSendClaimRewardsTransaction,
  useSendPoolWideClaimRewardsTransaction,
  useToken
} from '@generationsoftware/hyperstructure-react-hooks'
import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { TokenAmount, TransactionButton } from '@shared/react-components'
import { getSecondsSinceEpoch, lower } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import { useUserClaimablePoolWidePromotions } from '@hooks/useUserClaimablePoolWidePromotions'
import { useUserClaimablePromotions } from '@hooks/useUserClaimablePromotions'
import { useUserClaimedPoolWidePromotions } from '@hooks/useUserClaimedPoolWidePromotions'
import { useUserClaimedPromotions } from '@hooks/useUserClaimedPromotions'

interface AccountPromotionClaimActionsProps {
  chainId: number
  promotionId: bigint
  userAddress?: Address
  vaultAddress?: Address
  isPoolWide?: boolean
  fullSized?: boolean
  className?: string
}

export const AccountPromotionClaimActions = (props: AccountPromotionClaimActionsProps) => {
  const { chainId, promotionId, userAddress, vaultAddress, isPoolWide, fullSized, className } =
    props

  const { address: _userAddress } = useAccount()

  if (!!userAddress) {
    return (
      <ClaimRewardsButton
        chainId={chainId}
        promotionId={promotionId}
        userAddress={userAddress ?? _userAddress}
        vaultAddress={vaultAddress}
        isPoolWide={isPoolWide}
        fullSized={fullSized}
        className={className}
      />
    )
  }

  return <></>
}

interface ClaimRewardsButtonProps {
  chainId: number
  promotionId: bigint
  userAddress: Address
  vaultAddress?: Address
  isPoolWide?: boolean
  fullSized?: boolean
  className?: string
}

const ClaimRewardsButton = (props: ClaimRewardsButtonProps) => {
  const { chainId, promotionId, userAddress, vaultAddress, isPoolWide, fullSized, className } =
    props

  const t_common = useTranslations('Common')
  const t_account = useTranslations('Account')
  const t_txs = useTranslations('TxModals')

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

  const { refetch: refetchClaimed } = useUserClaimedPromotions(userAddress)
  const { refetch: refetchPoolWideClaimed } = useUserClaimedPoolWidePromotions(userAddress)

  const {
    data: allClaimable,
    isFetched: isFetchedAllClaimable,
    refetch: refetchClaimable
  } = useUserClaimablePromotions(userAddress)
  const {
    data: allPoolWideClaimable,
    isFetched: isFetchedAllPoolWideClaimable,
    refetch: refetchPoolWideClaimable
  } = useUserClaimablePoolWidePromotions(userAddress)

  const promotion = useMemo(() => {
    return (isPoolWide ? allPoolWideClaimable : allClaimable).find(
      (promotion) =>
        promotion.chainId === chainId &&
        promotion.promotionId === promotionId &&
        (!vaultAddress || lower(promotion.vault) === lower(vaultAddress))
    )
  }, [isPoolWide, allClaimable, allPoolWideClaimable, chainId, promotionId, vaultAddress])

  const { data: token } = useToken(chainId, promotion?.token!)

  const epochsToClaim =
    !!promotion && (isPoolWide ? isFetchedAllPoolWideClaimable : isFetchedAllClaimable)
      ? Object.keys(promotion.epochRewards).map((k) => parseInt(k))
      : []

  const {
    isWaiting: isWaitingClaimRewards,
    isConfirming: isConfirmingClaimRewards,
    isSuccess: isSuccessClaimRewards,
    txHash: txHashClaimRewards,
    sendClaimRewardsTransaction
  } = useSendClaimRewardsTransaction(
    chainId,
    userAddress,
    { [promotionId.toString()]: epochsToClaim },
    {
      onSuccess: () => {
        refetchClaimed()
        refetchClaimable()
      }
    }
  )

  const {
    isWaiting: isWaitingPoolWideClaimRewards,
    isConfirming: isConfirmingPoolWideClaimRewards,
    isSuccess: isSuccessPoolWideClaimRewards,
    txHash: txHashPoolWideClaimRewards,
    sendPoolWideClaimRewardsTransaction
  } = useSendPoolWideClaimRewardsTransaction(
    chainId,
    userAddress,
    { [promotionId.toString()]: { vaultAddress: promotion?.vault!, epochs: epochsToClaim } },
    {
      onSuccess: () => {
        refetchPoolWideClaimed()
        refetchPoolWideClaimable()
      }
    }
  )

  const isWaiting = isPoolWide ? isWaitingPoolWideClaimRewards : isWaitingClaimRewards
  const isConfirming = isPoolWide ? isConfirmingPoolWideClaimRewards : isConfirmingClaimRewards
  const isSuccess = isPoolWide ? isSuccessPoolWideClaimRewards : isSuccessClaimRewards
  const txHash = isPoolWide ? txHashPoolWideClaimRewards : txHashClaimRewards
  const sendTransaction = isPoolWide
    ? sendPoolWideClaimRewardsTransaction
    : sendClaimRewardsTransaction

  if (!!promotion && !!token) {
    const claimableAmount = Object.values(promotion.epochRewards).reduce((a, b) => a + b, 0n)

    if (claimableAmount > 0n) {
      const shiftedClaimableAmount = parseFloat(formatUnits(claimableAmount, token.decimals))

      const endTimestamp = !!promotion.numberOfEpochs
        ? Number(promotion.startTimestamp) + promotion.numberOfEpochs * promotion.epochDuration
        : undefined
      const isClaimWarningDisplayed = !!endTimestamp && endTimestamp < getSecondsSinceEpoch()

      return (
        <div className='flex flex-col'>
          <TransactionButton
            chainId={chainId}
            isTxLoading={isWaiting || isConfirming}
            isTxSuccess={isSuccess}
            write={sendTransaction}
            txHash={txHash}
            txDescription={t_account('claimRewardsTx', { symbol: token.symbol })}
            openConnectModal={openConnectModal}
            openChainModal={openChainModal}
            addRecentTransaction={addRecentTransaction}
            intl={{ base: t_txs, common: t_common }}
            fullSized={fullSized}
            className={classNames('min-w-[6rem]', className)}
          >
            {t_common('claim')}{' '}
            <TokenAmount
              token={{ chainId, address: promotion.token, amount: claimableAmount }}
              hideZeroes={shiftedClaimableAmount > 1e3 ? true : undefined}
              maximumFractionDigits={shiftedClaimableAmount <= 1e3 ? 2 : undefined}
            />
          </TransactionButton>
          {isClaimWarningDisplayed && (
            <span className='mt-1 mr-1 text-right text-pt-warning-light'>
              {t_account('claimSoon')}
            </span>
          )}
        </div>
      )
    }
  }

  return <></>
}
