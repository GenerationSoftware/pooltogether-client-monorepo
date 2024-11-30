import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  usePromotionCreatedEvents,
  usePublicClientsByChain,
  useSendCreatePromotionTransaction,
  useToken,
  useTokenAllowance
} from '@generationsoftware/hyperstructure-react-hooks'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { TransactionButton } from '@shared/react-components'
import { calculatePercentageOfBigInt, TWAB_REWARDS_ADDRESSES } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import {
  promotionChainIdAtom,
  promotionEpochLengthAtom,
  promotionEpochsAtom,
  promotionStartTimestampAtom,
  promotionTokenAddressAtom,
  promotionTokenAmountAtom,
  promotionVaultAddressAtom
} from 'src/atoms'
import { useAccount } from 'wagmi'
import { PROMOTION_FILTERS } from '@constants/config'
import { useSendApproveTransaction } from '@hooks/useSendApproveTransaction'

interface DeployPromotionButtonProps {
  onSuccess?: () => void
  className?: string
  innerClassName?: string
}

export const DeployPromotionButton = (props: DeployPromotionButtonProps) => {
  const { onSuccess, className, innerClassName } = props

  const { address: userAddress } = useAccount()
  const publicClients = usePublicClientsByChain({ useAll: true })

  const chainId = useAtomValue(promotionChainIdAtom)
  const vaultAddress = useAtomValue(promotionVaultAddressAtom)
  const startTimestamp = useAtomValue(promotionStartTimestampAtom)
  const numEpochs = useAtomValue(promotionEpochsAtom)
  const epochDuration = useAtomValue(promotionEpochLengthAtom)
  const rewardTokenAddress = useAtomValue(promotionTokenAddressAtom)
  const _rewardTokenAmount = useAtomValue(promotionTokenAmountAtom)

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

  const vault = useMemo(() => {
    if (!!chainId && !!vaultAddress) {
      return new Vault(chainId, vaultAddress, publicClients[chainId])
    }
  }, [chainId, vaultAddress, publicClients])

  const { data: rewardToken } = useToken(chainId!, rewardTokenAddress!)

  const rewardTokenAmount = useMemo(() => {
    if (!!numEpochs && !!_rewardTokenAmount && !!rewardToken) {
      const perEpoch = calculatePercentageOfBigInt(
        _rewardTokenAmount,
        Math.floor((1 / numEpochs) * 1e8) / 1e8
      )
      const total = perEpoch * BigInt(numEpochs)

      return { perEpoch, total }
    }
  }, [numEpochs, _rewardTokenAmount, rewardToken])

  const { refetch: refetchPromotionCreatedEvents } = usePromotionCreatedEvents(
    chainId!,
    !!chainId ? PROMOTION_FILTERS[chainId] : undefined
  )

  const twabRewardsAddress = !!vault ? TWAB_REWARDS_ADDRESSES[vault.chainId] : undefined
  const {
    data: allowance,
    isFetched: isFetchedAllowance,
    refetch: refetchTokenAllowance
  } = useTokenAllowance(chainId!, userAddress!, twabRewardsAddress!, rewardTokenAddress!)

  const {
    isWaiting: isWaitingApproval,
    isConfirming: isConfirmingApproval,
    isSuccess: isSuccessfulApproval,
    txHash: approvalTxHash,
    sendApproveTransaction
  } = useSendApproveTransaction(chainId!, rewardTokenAddress!, rewardTokenAmount?.total!, {
    onSuccess: () => refetchTokenAllowance()
  })

  const { isWaiting, isConfirming, isSuccess, txHash, sendCreatePromotionTransaction } =
    useSendCreatePromotionTransaction(
      vault!,
      rewardTokenAddress!,
      numEpochs!,
      rewardTokenAmount?.perEpoch!,
      {
        startTimestamp,
        epochDuration,
        onSend: () => {
          // TODO: create tx toast
        },
        onSuccess: () => {
          refetchPromotionCreatedEvents()
          refetchTokenAllowance()
          onSuccess?.()
        }
      }
    )

  const approvalEnabled =
    !!chainId && !!rewardTokenAddress && !!rewardTokenAmount?.total && !!sendApproveTransaction

  const deployPromotionEnabled =
    !!vault &&
    !!numEpochs &&
    !!epochDuration &&
    !!rewardToken &&
    !!rewardTokenAmount?.perEpoch &&
    !!sendCreatePromotionTransaction

  if (!chainId || !rewardTokenAmount) {
    return <></>
  }

  if (isFetchedAllowance && allowance !== undefined && allowance < rewardTokenAmount.total) {
    return (
      <TransactionButton
        chainId={chainId}
        isTxLoading={isWaitingApproval || isConfirmingApproval || isConfirming}
        isTxSuccess={isSuccessfulApproval}
        write={sendApproveTransaction}
        txHash={approvalTxHash}
        txDescription={`${rewardToken?.symbol} Approval`}
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
        Approve {rewardToken?.symbol}
      </TransactionButton>
    )
  } else {
    return (
      <TransactionButton
        chainId={chainId}
        isTxLoading={isWaiting || isConfirming}
        isTxSuccess={isSuccess}
        write={sendCreatePromotionTransaction}
        txHash={txHash}
        txDescription={`Deploy ${rewardToken?.symbol} Rewards`}
        disabled={!deployPromotionEnabled}
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
        Deploy Rewards <ArrowRightIcon className='w-4 h-4' />
      </TransactionButton>
    )
  }
}
