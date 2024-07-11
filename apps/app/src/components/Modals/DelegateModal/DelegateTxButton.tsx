import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useSendDelegateTransaction,
  useUserVaultDelegate,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { TransactionButton } from '@shared/react-components'
import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { Address, isAddress, TransactionReceipt } from 'viem'
import { useAccount } from 'wagmi'
import { DelegateModalView } from '.'
import { delegateFormNewDelegateAddressAtom } from './DelegateForm'

interface DelegateTxButtonProps {
  twabController: Address
  vault: Vault
  setModalView: (view: DelegateModalView) => void
  setDelegateTxHash: (txHash: string) => void
  onSuccessfulDelegation?: (chainId: number, txReceipt: TransactionReceipt) => void
}

export const DelegateTxButton = (props: DelegateTxButtonProps) => {
  const { twabController, vault, setModalView, setDelegateTxHash, onSuccessfulDelegation } = props

  const t_txModals = useTranslations('TxModals')
  const t_common = useTranslations('Common')

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

  const { address: userAddress, chain, isDisconnected } = useAccount()

  const { data: tokenData } = useVaultTokenData(vault)

  const newDelegateAddress: Address | undefined = useAtomValue(delegateFormNewDelegateAddressAtom)

  const { data: delegate, refetch: refetchUserVaultDelegate } = useUserVaultDelegate(
    vault,
    userAddress!,
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
      txDescription={t_txModals('delegateTx', { symbol: tokenData?.symbol ?? '?' })}
      fullSized={true}
      disabled={!delegateEnabled}
      color={!delegateEnabled && chain?.id === vault.chainId ? 'transparent' : 'teal'}
      openConnectModal={openConnectModal}
      openChainModal={openChainModal}
      addRecentTransaction={addRecentTransaction}
      intl={{ base: t_txModals, common: t_common }}
    >
      {t_txModals('updateDelegatedAddress')}
    </TransactionButton>
  )
}
