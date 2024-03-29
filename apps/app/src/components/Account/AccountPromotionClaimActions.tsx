import {
  useSendClaimRewardsTransaction,
  useToken
} from '@generationsoftware/hyperstructure-react-hooks'
import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { TokenAmount, TransactionButton } from '@shared/react-components'
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

  const claimable = useMemo(() => {
    return allClaimable.find(
      (promotion) => promotion.chainId === chainId && promotion.promotionId === promotionId
    )
  }, [allClaimable])

  const { data: tokenData } = useToken(chainId, claimable?.token as Address)

  const epochsToClaim =
    !!claimable && isFetchedAllClaimable
      ? Object.keys(claimable.epochRewards).map((k) => parseInt(k))
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

  if (!!claimable && !!tokenData) {
    const claimableAmount = Object.values(claimable.epochRewards).reduce((a, b) => a + b, 0n)

    if (claimableAmount > 0n) {
      const shiftedClaimableAmount = parseFloat(formatUnits(claimableAmount, tokenData.decimals))

      // TODO: display warning to claim soon if promotion has ended
      return (
        <TransactionButton
          chainId={chainId}
          isTxLoading={isWaiting || isConfirming}
          isTxSuccess={isSuccess}
          write={sendClaimRewardsTransaction}
          txHash={txHash}
          txDescription={t_account('claimRewardsTx', { symbol: tokenData.symbol })}
          openConnectModal={openConnectModal}
          openChainModal={openChainModal}
          addRecentTransaction={addRecentTransaction}
          intl={{ base: t_txs, common: t_common }}
          fullSized={fullSized}
          className={classNames('min-w-[6rem]', className)}
        >
          {t_common('claim')}{' '}
          <TokenAmount
            token={{ chainId, address: claimable.token, amount: claimableAmount }}
            hideZeroes={shiftedClaimableAmount > 1e3 ? true : undefined}
            maximumFractionDigits={shiftedClaimableAmount <= 1e3 ? 2 : undefined}
          />
        </TransactionButton>
      )
    }
  }

  return <></>
}
