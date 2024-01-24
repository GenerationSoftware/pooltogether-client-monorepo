import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useSendDelegateTransaction,
  useUserVaultDelegate,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { Intl } from '@shared/types'
import { Spinner } from '@shared/ui'
import { Button } from '@shared/ui'
import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { Address } from 'viem'
import { useAccount, useNetwork } from 'wagmi'
import { DelegateModalView } from '.'
import { delegateFormNewDelegateAddressAtom } from '../../Form/DelegateForm'
import { isValidFormInput } from '../../Form/TxFormInput'
// import { isValidFormInput } from '../../Form/TxFormInput'
import { TransactionButton } from '../../Transaction/TransactionButton'

interface DelegateTxButtonProps {
  twabController: Address
  vault: Vault
  modalView: string
  setModalView: (view: DelegateModalView) => void
  setDelegateTxHash: (txHash: string) => void
  openConnectModal?: () => void
  openChainModal?: () => void
  addRecentTransaction?: (tx: { hash: string; description: string; confirmations?: number }) => void
  onSuccessfulDelegation?: () => void
  intl?: {
    base?: Intl<
      | 'enterAnAmount'
      | 'updateDelegatedAddress'
      | 'delegateTx'
      | 'confirmDelegation'
      | 'switchNetwork'
      | 'switchingNetwork'
    >
    common?: Intl<'connectWallet'>
  }
}

export const DelegateTxButton = (props: DelegateTxButtonProps) => {
  const {
    twabController,
    vault,
    modalView,
    setModalView,
    setDelegateTxHash,
    openConnectModal,
    openChainModal,
    addRecentTransaction,
    onSuccessfulDelegation,
    intl
  } = props

  const { address: userAddress, isDisconnected } = useAccount()
  const { chain } = useNetwork()

  const { data: tokenData } = useVaultTokenData(vault)

  const newDelegateAddress: Address = useAtomValue(delegateFormNewDelegateAddressAtom)

  const isValidChangeDelegateForm = false
  // const isValidChangeDelegateForm = isValidFormInput(formShareAmount, decimals)

  const { refetch: refetchUserVaultDelegate } = useUserVaultDelegate(
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
    onSuccess: () => {
      refetchUserVaultDelegate()
      onSuccessfulDelegation?.()
      setModalView('success')
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

  const formIsValid = false

  const delegateEnabled =
    !isDisconnected &&
    !!userAddress &&
    formIsValid &&
    !!newDelegateAddress &&
    !!sendDelegateTransaction

  if (!!delegateTxHash || isConfirmingDelegation) {
    return (
      <Button color='transparent' fullSized={true} disabled={true}>
        <Spinner /> Waiting for transaction
      </Button>
    )
  } else if (!formIsValid) {
    return (
      <Button color='transparent' fullSized={true} disabled={true}>
        {intl?.base?.('updateDelegatedAddress') ?? 'Update delegated address'}
      </Button>
    )
  } else if (!isDisconnected && chain?.id === vault.chainId && modalView === 'main') {
    return (
      <Button onClick={() => setModalView('review')} fullSized={true} disabled={!delegateEnabled}>
        {intl?.base?.('updateDelegatedAddress') ?? 'Update delegated address'}
      </Button>
    )
  } else {
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
        openConnectModal={openConnectModal}
        openChainModal={openChainModal}
        addRecentTransaction={addRecentTransaction}
        intl={intl}
      >
        {intl?.base?.('confirmDelegation') ?? 'Confirm Delegation'}
      </TransactionButton>
    )
  }
}
