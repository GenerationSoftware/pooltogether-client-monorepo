import { useSendDestroyPromotionTransaction } from '@generationsoftware/hyperstructure-react-hooks'
import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { TransactionButton } from '@shared/react-components'
import classNames from 'classnames'
import { Address } from 'viem'
import { useAllPromotions } from '@hooks/useAllPromotions'

interface DestroyPromotionButtonProps {
  chainId: number
  promotionId: number
  recipient: Address
  onSuccess?: () => void
  className?: string
  innerClassName?: string
}

export const DestroyPromotionButton = (props: DestroyPromotionButtonProps) => {
  const { chainId, promotionId, recipient, onSuccess, className, innerClassName } = props

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

  const { refetch: refetchAllPromotions } = useAllPromotions()

  const { isWaiting, isConfirming, isSuccess, txHash, sendDestroyPromotionTransaction } =
    useSendDestroyPromotionTransaction(chainId, promotionId, recipient, {
      onSend: () => {
        // TODO: create tx toast
      },
      onSuccess: () => {
        refetchAllPromotions()
        onSuccess?.()
      }
    })

  const destroyPromotionEnabled =
    !!chainId && !!promotionId && !!recipient && !!sendDestroyPromotionTransaction

  return (
    <TransactionButton
      chainId={chainId}
      isTxLoading={isWaiting || isConfirming}
      isTxSuccess={isSuccess}
      write={sendDestroyPromotionTransaction}
      txHash={txHash}
      txDescription={`Destroy Rewards`}
      disabled={!destroyPromotionEnabled}
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
      Destroy Rewards
    </TransactionButton>
  )
}
