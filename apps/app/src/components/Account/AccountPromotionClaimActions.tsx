import {
  useSendClaimRewardsTransaction,
  useToken
} from '@generationsoftware/hyperstructure-react-hooks'
import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { TokenAmount, TransactionButton } from '@shared/react-components'
import { getSecondsSinceEpoch } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import { useUserClaimablePromotions } from '@hooks/useUserClaimablePromotions'
import { useUserClaimedPromotions } from '@hooks/useUserClaimedPromotions'

interface AccountPromotionClaimActionsProps {
  chainId: number
  promotionId: bigint
  address?: Address
  fullSized?: boolean
  className?: string
}

export const AccountPromotionClaimActions = (props: AccountPromotionClaimActionsProps) => {
  const { chainId, promotionId, address, fullSized, className } = props

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  if (!!userAddress) {
    return (
      <ClaimRewardsButton
        chainId={chainId}
        promotionId={promotionId}
        userAddress={userAddress}
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
  fullSized?: boolean
  className?: string
}

const ClaimRewardsButton = (props: ClaimRewardsButtonProps) => {
  const { chainId, promotionId, userAddress, fullSized, className } = props

  const t_common = useTranslations('Common')
  const t_account = useTranslations('Account')
  const t_txs = useTranslations('TxModals')

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

  const { refetch: refetchClaimed } = useUserClaimedPromotions(userAddress)
  const {
    data: allClaimable,
    isFetched: isFetchedAllClaimable,
    refetch: refetchClaimable
  } = useUserClaimablePromotions(userAddress)

  const promotion = useMemo(() => {
    return allClaimable.find(
      (promotion) => promotion.chainId === chainId && promotion.promotionId === promotionId
    )
  }, [allClaimable])

  const { data: token } = useToken(chainId, promotion?.token!)

  const epochsToClaim =
    !!promotion && isFetchedAllClaimable
      ? Object.keys(promotion.epochRewards).map((k) => parseInt(k))
      : []
  const { isWaiting, isConfirming, isSuccess, txHash, sendClaimRewardsTransaction } =
    useSendClaimRewardsTransaction(
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
            write={sendClaimRewardsTransaction}
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
