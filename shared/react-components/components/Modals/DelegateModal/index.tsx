import {
  useSelectedVault,
  useVaultTwabController
} from '@generationsoftware/hyperstructure-react-hooks'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { Intl, RichIntl } from '@shared/types'
import { Modal } from '@shared/ui'
import { useState } from 'react'
import { createDelegateTxToast, DelegateTxToastProps } from '../../Toasts/DelegateTxToast'
import { DelegateModalBody } from './DelegateModalBody'
import { DelegateTxButton } from './DelegateTxButton'

export type DelegateModalView = 'main' | 'waiting' | 'confirming' | 'success' | 'error'

export interface DelegateModalProps {
  onClose?: () => void
  openConnectModal?: () => void
  openChainModal?: () => void
  addRecentTransaction?: (tx: { hash: string; description: string; confirmations?: number }) => void
  onSuccessfulDelegation?: () => void
  intl?: {
    base?: RichIntl<
      | 'delegateFrom'
      | 'delegateFromShort'
      | 'delegateDescription'
      | 'delegateSelfDescription'
      | 'delegatedAddress'
      | 'changeDelegateAddress'
      | 'changeDelegateAddressShort'
      | 'updateDelegatedAddress'
      | 'delegateTx'
      | 'switchNetwork'
      | 'switchingNetwork'
      | 'submissionNotice'
      | 'success'
      | 'delegated'
      | 'uhOh'
      | 'failedTx'
      | 'tryAgain'
    >
    tooltip?: Intl<'delegateDescription'>
    common?: Intl<'prizePool' | 'connectWallet' | 'close' | 'viewOn' | 'warning' | 'learnMore'>
    txToast?: DelegateTxToastProps['intl']
    errors?: RichIntl<'formErrors.invalidAddress' | 'formErrors.sameAsDelegate'>
  }
}

export const DelegateModal = (props: DelegateModalProps) => {
  const {
    onClose,
    openConnectModal,
    openChainModal,
    addRecentTransaction,
    onSuccessfulDelegation,
    intl
  } = props

  const { vault } = useSelectedVault()

  const { isModalOpen, setIsModalOpen } = useIsModalOpen(MODAL_KEYS.delegate, { onClose })

  const [view, setView] = useState<DelegateModalView>('main')

  const [delegateTxHash, setDelegateTxHash] = useState<string>()

  const { data: twabController } = useVaultTwabController(vault!)

  const createToast = () => {
    if (!!vault && !!delegateTxHash && view === 'confirming') {
      createDelegateTxToast({
        vault: vault,
        txHash: delegateTxHash,
        addRecentTransaction,
        intl: intl?.txToast
      })
    }
  }

  const handleClose = () => {
    createToast()
    setIsModalOpen(false)
    setView('main')
  }

  if (isModalOpen && !!vault) {
    const modalBodyContent = <DelegateModalBody modalView={view} vault={vault} intl={intl} />

    const modalFooterContent = (
      <div className={'flex flex-col items-center gap-6'}>
        <DelegateTxButton
          twabController={twabController!}
          vault={vault}
          setModalView={setView}
          setDelegateTxHash={setDelegateTxHash}
          openConnectModal={openConnectModal}
          openChainModal={openChainModal}
          addRecentTransaction={addRecentTransaction}
          onSuccessfulDelegation={onSuccessfulDelegation}
          intl={intl}
        />
      </div>
    )

    return (
      <Modal
        bodyContent={modalBodyContent}
        footerContent={modalFooterContent}
        onClose={handleClose}
        label='delegate-flow'
        hideHeader={true}
        mobileStyle='tab'
      />
    )
  }

  return <></>
}
