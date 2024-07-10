import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useSendDelegateTransaction,
  useUserVaultDelegate,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { Intl } from '@shared/types'
import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { Address, isAddress, TransactionReceipt } from 'viem'
import { useAccount } from 'wagmi'
import { DelegateModalView } from '.'
import { TransactionButton } from '../../Buttons/TransactionButton'
import { delegateFormNewDelegateAddressAtom } from '../../Form/DelegateForm'

interface DelegateTxButtonProps {
  twabController: Address
  vault: Vault
  setModalView: (view: DelegateModalView) => void
  setDelegateTxHash: (txHash: string) => void
  openConnectModal?: () => void
  openChainModal?: () => void
  addRecentTransaction?: (tx: { hash: string; description: string; confirmations?: number }) => void
  onSuccessfulDelegation?: (chainId: number, txReceipt: TransactionReceipt) => void
  intl?: {
    base?: Intl<'updateDelegatedAddress' | 'delegateTx' | 'switchNetwork' | 'switchingNetwork'>
    common?: Intl<'connectWallet'>
  }
}

export const DelegateTxButton = (props: DelegateTxButtonProps) => {
  const {
    twabController,
    vault,
    setModalView,
    setDelegateTxHash,
    openConnectModal,
    openChainModal,
    addRecentTransaction,
    onSuccessfulDelegation,
    intl
  } = props

  const { address: userAddress, chain, isDisconnected } = useAccount()

  const { data: tokenData } = useVaultTokenData(vault)

  const newDelegateAddress: Address | undefined = useAtomValue(delegateFormNewDelegateAddressAtom)

  const { data: delegate, refetch: refetchUserVaultDelegate } = useUserVaultDelegate(
    vault,
    userAddress as Address,
    { refetchOnWindowFocus: true }
  )

  const {
    isWaiting: isWaitingDelegation,
    isConfirming: isConfirmingDelegation,
    isSuccess: isSuccessfulDelegation,
    txHash: delegateTxHash,
    sendDelegateTransaction
  } = useSendDelegateTransaction(twabController, newDelegateAddress, vault, {
    onSend: () => {
      setModalView('waiting')
    },
    onSuccess: (txReceipt) => {
      refetchUserVaultDelegate()
      onSuccessfulDelegation?.(vault.chainId, txReceipt)
      setModalView('main')
    },
    onError: () => {
      setModalView('error')
    }
  })

  useEffect(() => {
    if (
      !!delegateTxHash &&
      isConfirmingDelegation &&
      !isWaitingDelegation &&
      !isSuccessfulDelegation
    ) {
      setDelegateTxHash(delegateTxHash)
      setModalView('confirming')
    }
  }, [delegateTxHash, isConfirmingDelegation])

  const hasDelegateAddressChanged = newDelegateAddress !== delegate

  const delegateEnabled =
    !isDisconnected &&
    !!userAddress &&
    !!newDelegateAddress &&
    isAddress(newDelegateAddress) &&
    !isWaitingDelegation &&
    !isConfirmingDelegation &&
    hasDelegateAddressChanged &&
    !!sendDelegateTransaction

  return (
    <TransactionButton
      chainId={vault.chainId}
      isTxLoading={isWaitingDelegation || isConfirmingDelegation}
      isTxSuccess={isSuccessfulDelegation}
      write={sendDelegateTransaction}
      txHash={delegateTxHash}
      txDescription={
        intl?.base?.('delegateTx', { symbol: tokenData?.symbol ?? '?' }) ??
        `${tokenData?.symbol} Delegation`
      }
      fullSized={true}
      disabled={!delegateEnabled}
      color={!delegateEnabled && chain?.id === vault.chainId ? 'transparent' : 'teal'}
      openConnectModal={openConnectModal}
      openChainModal={openChainModal}
      addRecentTransaction={addRecentTransaction}
      intl={intl}
    >
      {intl?.base?.('updateDelegatedAddress') ?? 'Update delegated address'}
    </TransactionButton>
  )
}
