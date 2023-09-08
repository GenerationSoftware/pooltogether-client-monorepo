import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useSendClaimVaultFeesTransaction,
  useVaultFeesAvailable
} from '@generationsoftware/hyperstructure-react-hooks'
import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { TransactionButton } from '@shared/react-components'

interface ClaimVaultFeesButtonProps {
  vault: Vault
  onSuccess?: () => void
  className?: string
  innerClassName?: string
}

export const ClaimVaultFeesButton = (props: ClaimVaultFeesButtonProps) => {
  const { vault, onSuccess, className, innerClassName } = props

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

  const { data: vaultFeesAvailable, isFetched: isFetchedVaultFeesAvailable } =
    useVaultFeesAvailable(vault)

  const {
    isWaiting: isWaitingClaim,
    isConfirming: isConfirmingClaim,
    isSuccess: isSuccessfulClaim,
    txHash: claimTxHash,
    sendClaimVaultFeesTransaction
  } = useSendClaimVaultFeesTransaction(vaultFeesAvailable ?? 0n, vault, {
    onSend: () => {
      if (!!vault.chainId) {
        // TODO: create tx toast for fee claiming
      }
    },
    onSuccess: () => {
      onSuccess?.()
    }
  })

  const claimVaultFeesEnabled =
    !!vault.chainId &&
    isFetchedVaultFeesAvailable &&
    !!vaultFeesAvailable &&
    !!sendClaimVaultFeesTransaction

  if (!vault.chainId) {
    return <></>
  }

  return (
    <TransactionButton
      chainId={vault.chainId}
      isTxLoading={isWaitingClaim || isConfirmingClaim}
      isTxSuccess={isSuccessfulClaim}
      write={sendClaimVaultFeesTransaction}
      txHash={claimTxHash}
      txDescription={`Claim Vault Fees`}
      disabled={!claimVaultFeesEnabled}
      openConnectModal={openConnectModal}
      openChainModal={openChainModal}
      addRecentTransaction={addRecentTransaction}
      color='transparent'
      className={className}
      innerClassName={innerClassName}
    >
      Claim Fees
    </TransactionButton>
  )
}
