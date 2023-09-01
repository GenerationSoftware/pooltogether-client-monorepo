import {
  useSendSetLiquidationPairTransaction,
  useVault,
  useVaultLiquidationPair
} from '@generationsoftware/hyperstructure-react-hooks'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { createSetLiquidationPairTxToast, TransactionButton } from '@shared/react-components'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { liquidationPairAddressAtom } from 'src/atoms'
import { SupportedNetwork } from 'src/types'
import { Address } from 'viem'

interface SetLiquidationPairButtonProps {
  chainId: SupportedNetwork
  vaultAddress: Address
  onSuccess?: () => void
  className?: string
  innerClassName?: string
}

export const SetLiquidationPairButton = (props: SetLiquidationPairButtonProps) => {
  const { chainId, vaultAddress, onSuccess, className, innerClassName } = props

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

  const lpAddress = useAtomValue(liquidationPairAddressAtom) as Address

  const vault = useVault({ chainId, address: vaultAddress })

  const { refetch: refetchVaultLiquidationPair } = useVaultLiquidationPair(vault)

  const {
    isWaiting: isWaitingSet,
    isConfirming: isConfirmingSet,
    isSuccess: isSuccessfulSet,
    txHash: setTxHash,
    sendSetLiquidationPairTransaction
  } = useSendSetLiquidationPairTransaction(lpAddress, vault, {
    onSend: (txHash) => {
      createSetLiquidationPairTxToast({ chainId, txHash, addRecentTransaction })
    },
    onSuccess: () => {
      refetchVaultLiquidationPair()
      onSuccess?.()
    }
  })

  const setLiquidationPairEnabled = !!sendSetLiquidationPairTransaction

  return (
    <TransactionButton
      chainId={chainId}
      isTxLoading={isWaitingSet || isConfirmingSet}
      isTxSuccess={isSuccessfulSet}
      write={sendSetLiquidationPairTransaction}
      txHash={setTxHash}
      txDescription={`Set Liquidation Pair`}
      disabled={!setLiquidationPairEnabled}
      openConnectModal={openConnectModal}
      openChainModal={openChainModal}
      addRecentTransaction={addRecentTransaction}
      color='purple'
      className={classNames(
        'w-54 !bg-pt-purple-600 !border-pt-purple-600 hover:!bg-pt-purple-700 focus:outline-transparent',
        className
      )}
      innerClassName={classNames('flex gap-2 items-center text-pt-purple-50', innerClassName)}
    >
      Set Liquidation Pair <ArrowRightIcon className='w-4 h-4' />
    </TransactionButton>
  )
}
