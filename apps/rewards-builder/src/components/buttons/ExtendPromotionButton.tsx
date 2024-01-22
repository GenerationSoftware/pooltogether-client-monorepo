import {
  useSendExtendPromotionTransaction,
  useTokenAllowance,
  useTokenBalance
} from '@generationsoftware/hyperstructure-react-hooks'
import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { TransactionButton } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { TWAB_REWARDS_ADDRESSES } from '@shared/utilities'
import classNames from 'classnames'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useAllPromotions } from '@hooks/useAllPromotions'
import { useSendApproveTransaction } from '@hooks/useSendApproveTransaction'

interface ExtendPromotionButtonProps {
  chainId: number
  promotionId: number
  tokenAddress: Address
  tokensPerEpoch: bigint
  numEpochs: number
  onSuccess?: () => void
  className?: string
  innerClassName?: string
}

export const ExtendPromotionButton = (props: ExtendPromotionButtonProps) => {
  const {
    chainId,
    promotionId,
    tokenAddress,
    tokensPerEpoch,
    numEpochs,
    onSuccess,
    className,
    innerClassName
  } = props

  const { address: userAddress } = useAccount()

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

  const { refetch: refetchAllPromotions } = useAllPromotions()

  const {
    data: allowance,
    isFetched: isFetchedAllowance,
    refetch: refetchTokenAllowance
  } = useTokenAllowance(
    chainId,
    userAddress as Address,
    TWAB_REWARDS_ADDRESSES[chainId],
    tokenAddress
  )

  const {
    data: token,
    isFetched: isFetchedTokenBalance,
    refetch: refetchTokenBalance
  } = useTokenBalance(chainId, userAddress as Address, tokenAddress, { refetchOnWindowFocus: true })

  const tokenAmount = tokensPerEpoch * BigInt(numEpochs)

  const {
    isWaiting: isWaitingApproval,
    isConfirming: isConfirmingApproval,
    isSuccess: isSuccessfulApproval,
    txHash: approvalTxHash,
    sendApproveTransaction
  } = useSendApproveTransaction(chainId, tokenAddress, tokenAmount, {
    onSuccess: () => refetchTokenAllowance()
  })

  const { isWaiting, isConfirming, isSuccess, txHash, sendExtendPromotionTransaction } =
    useSendExtendPromotionTransaction(
      chainId,
      promotionId,
      tokenAddress,
      tokensPerEpoch,
      numEpochs,
      {
        onSend: () => {
          // TODO: create tx toast
        },
        onSuccess: () => {
          refetchAllPromotions()
          refetchTokenAllowance()
          refetchTokenBalance()
          onSuccess?.()
        }
      }
    )

  const approvalEnabled = !!token && !!sendApproveTransaction

  const extendPromotionEnabled =
    !!promotionId && !!token && !!tokenAmount && !!sendExtendPromotionTransaction

  if (isFetchedAllowance && allowance !== undefined && allowance < tokenAmount) {
    return (
      <TransactionButton
        chainId={chainId}
        isTxLoading={isWaitingApproval || isConfirmingApproval || isConfirming}
        isTxSuccess={isSuccessfulApproval}
        write={sendApproveTransaction}
        txHash={approvalTxHash}
        txDescription={`${token?.symbol} Approval`}
        disabled={!approvalEnabled}
        openConnectModal={openConnectModal}
        openChainModal={openChainModal}
        addRecentTransaction={addRecentTransaction}
        color='purple'
        className={classNames(
          'min-w-[9rem] !bg-pt-purple-600 !border-pt-purple-600 hover:!bg-pt-purple-700 focus:outline-transparent',
          className
        )}
        innerClassName={classNames('flex gap-2 items-center text-pt-purple-50', innerClassName)}
      >
        Approve {token?.symbol}
      </TransactionButton>
    )
  } else {
    return (
      <TransactionButton
        chainId={chainId}
        isTxLoading={isWaiting || isConfirming}
        isTxSuccess={isSuccess}
        write={sendExtendPromotionTransaction}
        txHash={txHash}
        txDescription={`Extend ${token?.symbol} Rewards`}
        disabled={!extendPromotionEnabled}
        openConnectModal={openConnectModal}
        openChainModal={openChainModal}
        addRecentTransaction={addRecentTransaction}
        color='purple'
        className={classNames(
          'min-w-[9rem] !bg-pt-purple-600 !border-pt-purple-600 hover:!bg-pt-purple-700 focus:outline-transparent',
          className
        )}
        innerClassName={classNames('flex gap-2 items-center text-pt-purple-50', innerClassName)}
      >
        {isFetchedTokenBalance && token !== undefined ? (
          token.amount >= tokenAmount ? (
            'Extend Rewards'
          ) : (
            `Not enough ${token?.symbol} in wallet`
          )
        ) : (
          <Spinner />
        )}
      </TransactionButton>
    )
  }
}
