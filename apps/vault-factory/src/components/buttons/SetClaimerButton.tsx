import {
  useSendSetClaimerTransaction,
  useVault,
  useVaultClaimer
} from '@generationsoftware/hyperstructure-react-hooks'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { createSetClaimerTxToast, TransactionButton } from '@shared/react-components'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { liquidationPairAddressAtom } from 'src/atoms'
import { SupportedNetwork } from 'src/types'
import { Address } from 'viem'

interface SetClaimerButtonProps {
  chainId: SupportedNetwork
  vaultAddress: Address
  onSuccess?: () => void
  className?: string
  innerClassName?: string
}

export const SetClaimerButton = (props: SetClaimerButtonProps) => {
  const { chainId, vaultAddress, onSuccess, className, innerClassName } = props

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

  const lpAddress = useAtomValue(liquidationPairAddressAtom) as Address

  const vault = useVault({ chainId, address: vaultAddress })

  const { refetch: refetchVaultClaimer } = useVaultClaimer(vault)

  const {
    isWaiting: isWaitingSet,
    isConfirming: isConfirmingSet,
    isSuccess: isSuccessfulSet,
    txHash: setTxHash,
    sendSetClaimerTransaction
  } = useSendSetClaimerTransaction(lpAddress, vault, {
    onSend: (txHash) => {
      createSetClaimerTxToast({ chainId, txHash, addRecentTransaction })
    },
    onSuccess: () => {
      refetchVaultClaimer()
      onSuccess?.()
    }
  })

  const setClaimerEnabled = !!sendSetClaimerTransaction

  return (
    <TransactionButton
      chainId={chainId}
      isTxLoading={isWaitingSet || isConfirmingSet}
      isTxSuccess={isSuccessfulSet}
      write={sendSetClaimerTransaction}
      txHash={setTxHash}
      txDescription={`Set Claimer`}
      disabled={!setClaimerEnabled}
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
      Set Claimer <ArrowRightIcon className='w-4 h-4' />
    </TransactionButton>
  )
}
