import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  usePromotionCreatedEvents,
  usePublicClientsByChain,
  useSendCreatePromotionTransaction,
  useToken
} from '@generationsoftware/hyperstructure-react-hooks'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { TransactionButton } from '@shared/react-components'
import { calculatePercentageOfBigInt } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import {
  promotionChainIdAtom,
  promotionEpochLengthAtom,
  promotionEpochsAtom,
  promotionTokenAddressAtom,
  promotionTokenAmountAtom,
  promotionVaultAddressAtom
} from 'src/atoms'
import { SupportedNetwork } from 'src/types'
import { Address } from 'viem'
import { PROMOTION_FILTERS } from '@constants/config'

interface DeployPromotionButtonProps {
  onSuccess?: () => void
  className?: string
  innerClassName?: string
}

export const DeployPromotionButton = (props: DeployPromotionButtonProps) => {
  const { onSuccess, className, innerClassName } = props

  const publicClients = usePublicClientsByChain({ useAll: true })

  const chainId = useAtomValue(promotionChainIdAtom)
  const vaultAddress = useAtomValue(promotionVaultAddressAtom)
  const numEpochs = useAtomValue(promotionEpochsAtom)
  const epochDuration = useAtomValue(promotionEpochLengthAtom)
  const rewardTokenAddress = useAtomValue(promotionTokenAddressAtom)
  const rewardTokenAmount = useAtomValue(promotionTokenAmountAtom)

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

  const vault = useMemo(() => {
    if (!!chainId && !!vaultAddress) {
      return new Vault(chainId, vaultAddress, publicClients[chainId])
    }
  }, [chainId, vaultAddress, publicClients])

  const rewardTokensPerEpoch = useMemo(() => {
    if (!!numEpochs && !!rewardTokenAmount) {
      return calculatePercentageOfBigInt(rewardTokenAmount, 1 / numEpochs)
    }
  }, [numEpochs, rewardTokenAmount])

  const { data: rewardToken } = useToken(chainId as SupportedNetwork, rewardTokenAddress as Address)

  const { refetch: refetchPromotionCreatedEvents } = usePromotionCreatedEvents(
    chainId as SupportedNetwork,
    !!chainId ? PROMOTION_FILTERS[chainId] : undefined
  )

  const { isWaiting, isConfirming, isSuccess, txHash, sendCreatePromotionTransaction } =
    useSendCreatePromotionTransaction(
      vault as Vault,
      rewardTokenAddress as Address,
      numEpochs as number,
      rewardTokensPerEpoch as bigint,
      {
        epochDuration,
        onSend: () => {
          // TODO: create tx toast
        },
        onSuccess: () => {
          refetchPromotionCreatedEvents()
          onSuccess?.()
        }
      }
    )

  const deployPromotionEnabled =
    !!vault &&
    !!numEpochs &&
    !!epochDuration &&
    !!rewardToken &&
    !!rewardTokensPerEpoch &&
    !!sendCreatePromotionTransaction

  if (!chainId) {
    return <></>
  }

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
