import { useSendEndPromotionTransaction } from '@generationsoftware/hyperstructure-react-hooks'
import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { TransactionButton } from '@shared/react-components'
import classNames from 'classnames'
import { Address } from 'viem'
import { useAllPromotions } from '@hooks/useAllPromotions'

interface EndPromotionButtonProps {
  chainId: number
  promotionId: number
  recipient: Address
  onSuccess?: () => void
  className?: string
  innerClassName?: string
}

export const EndPromotionButton = (props: EndPromotionButtonProps) => {
  const { chainId, promotionId, recipient, onSuccess, className, innerClassName } = props

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

  const { refetch: refetchAllPromotions } = useAllPromotions()

  const { isWaiting, isConfirming, isSuccess, txHash, sendEndPromotionTransaction } =
    useSendEndPromotionTransaction(chainId, promotionId, recipient, {
      onSend: () => {
        // TODO: create tx toast
      },
      onSuccess: () => {
        refetchAllPromotions()
        onSuccess?.()
      }
    })

  const endPromotionEnabled =
    !!chainId && !!promotionId && !!recipient && !!sendEndPromotionTransaction

  return (
    <TransactionButton
      chainId={chainId}
      isTxLoading={isWaiting || isConfirming}
      isTxSuccess={isSuccess}
      write={sendEndPromotionTransaction}
      txHash={txHash}
      txDescription={`End Rewards`}
      disabled={!endPromotionEnabled}
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
      End Rewards
    </TransactionButton>
  )
}
