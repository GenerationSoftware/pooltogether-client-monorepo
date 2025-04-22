import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useSend5792DelegateTransaction,
  useSendDelegateTransaction,
  useUserVaultDelegate,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { useMiscSettings } from '@shared/generic-react-hooks'
import { TransactionButton } from '@shared/react-components'
import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { Address, isAddress } from 'viem'
import { useAccount } from 'wagmi'
import { useCapabilities } from 'wagmi/experimental'
import { PAYMASTER_URL } from '@constants/config'
import { DelegateModalView } from '.'
import { delegateFormNewDelegateAddressAtom } from './DelegateForm'

interface DelegateTxButtonProps {
  twabController: Address
  vault: Vault
  setModalView: (view: DelegateModalView) => void
  setDelegateTxHash: (txHash: string) => void
  onSuccessfulDelegation?: () => void
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

  const dataTx = useSendDelegateTransaction(twabController, newDelegateAddress, vault, {
    onSend: () => {
      setModalView('waiting')
    },
    onSuccess: () => {
      refetchUserVaultDelegate()
      onSuccessfulDelegation?.()
      setModalView('main')
    },
    onError: () => {
      setModalView('error')
    }
  })

  const { data: walletCapabilities } = useCapabilities()
  const { isActive: isEip5792Disabled } = useMiscSettings('eip5792Disabled')
  const isUsingEip5792 =
    Object.values(walletCapabilities?.[vault.chainId] ?? {}).some((c) => !!c.supported) &&
    !isEip5792Disabled

  const data5792Tx = useSend5792DelegateTransaction(twabController, newDelegateAddress, vault, {
    paymasterService: !!PAYMASTER_URL[vault.chainId]
      ? { url: PAYMASTER_URL[vault.chainId], optional: true }
      : undefined,
    onSend: () => {
      setModalView('waiting')
    },
    onSuccess: () => {
      refetchUserVaultDelegate()
      onSuccessfulDelegation?.()
      setModalView('main')
    },
    onError: () => {
      setModalView('error')
    },
    enabled: isUsingEip5792
  })

  const sendTx = isUsingEip5792
    ? data5792Tx.send5792DelegateTransaction
    : dataTx.sendDelegateTransaction
  const isWaitingDelegation = isUsingEip5792 ? data5792Tx.isWaiting : dataTx.isWaiting
  const isConfirmingDelegation = isUsingEip5792 ? data5792Tx.isConfirming : dataTx.isConfirming
  const isSuccessfulDelegation = isUsingEip5792 ? data5792Tx.isSuccess : dataTx.isSuccess
  const delegateTxHash = isUsingEip5792 ? data5792Tx.txHashes?.at(-1) : dataTx.txHash

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
    !!sendTx

  return (
    <TransactionButton
      chainId={vault.chainId}
      isTxLoading={isWaitingDelegation || isConfirmingDelegation}
      isTxSuccess={isSuccessfulDelegation}
      write={sendTx}
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
