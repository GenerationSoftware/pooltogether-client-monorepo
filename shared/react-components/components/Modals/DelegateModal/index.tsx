import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useSelectedVault,
  useVaultTwabController
} from '@generationsoftware/hyperstructure-react-hooks'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { Intl, RichIntl } from '@shared/types'
import { Modal } from '@shared/ui'
import { ReactNode, useState } from 'react'
import { Address } from 'viem'
import { createDelegateTxToast, DelegateTxToastProps } from '../../Toasts/DelegateTxToast'
import { NetworkFeesProps } from '../NetworkFees'
import { DelegateModalBody } from './DelegateModalBody'
import { DelegateTxButton } from './DelegateTxButton'

export type DelegateModalView = 'main' | 'waiting' | 'success' | 'error' | 'confirming'

export interface DelegateModalProps {
  openConnectModal?: () => void
  openChainModal?: () => void
  addRecentTransaction?: (tx: { hash: string; description: string; confirmations?: number }) => void
  onSuccessfulDelegation?: () => void
  intl?: {
    base?: RichIntl<
      | 'delegateFrom'
      | 'delegateFromShort'
      | 'delegateDescription'
      | 'delegatedAddress'
      | 'changeDelegateAddress'
      | 'updateDelegatedAddress'
      | 'delegateTx'
      | 'switchNetwork'
      | 'switchingNetwork'
      | 'confirmNotice'
      | 'submissionNotice'
      | 'success'
      | 'delegated'
      | 'waiting'
      | 'uhOh'
      | 'failedTx'
      | 'tryAgain'
    >
    common?: Intl<'prizePool' | 'connectWallet' | 'close' | 'viewOn' | 'warning'>
    fees?: NetworkFeesProps['intl']
    txToast?: DelegateTxToastProps['intl']
    errors?: RichIntl<'formErrors.invalidAddress'>
  }
}

export const DelegateModal = (props: DelegateModalProps) => {
  const { openConnectModal, openChainModal, addRecentTransaction, onSuccessfulDelegation, intl } =
    props

  const { vault } = useSelectedVault()

  const { isModalOpen, setIsModalOpen } = useIsModalOpen(MODAL_KEYS.delegate)

  const [view, setView] = useState<DelegateModalView>('main')

  const [delegateTxHash, setDelegateTxHash] = useState<string>()

  const { data: twabController, isFetched: isFetchedTwabController } = useVaultTwabController(
    vault as Vault
  )

  const createToast = () => {
    if (!!vault && !!delegateTxHash && view === 'confirming') {
      createDelegateTxToast({
        vault: vault,
        txHash: delegateTxHash,
        addRecentTransaction: addRecentTransaction,
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
    // const modalViews: Record<DelegateModalView, ReactNode> = {
    //   main: <MainView vault={vault} intl={intl} />,
    //   waiting: null,
    //   // waiting: <WaitingView vault={vault} closeModal={handleClose} intl={intl} />,
    //   confirming: null,
    //   // confirming: (
    //   //   <ConfirmingView vault={vault} txHash={depositTxHash} closeModal={handleClose} intl={intl} />
    //   // ),
    //   success: null,
    //   // success: (
    //   //   <SuccessView
    //   //     vault={vault}
    //   //     txHash={depositTxHash}
    //   //     closeModal={handleClose}
    //   //     goToAccount={onGoToAccount}
    //   //     intl={intl}
    //   //   />
    //   // ),
    //   error: null
    //   // error: <ErrorView setModalView={setView} intl={intl?.base} />
    // }
    console.log('view')
    console.log(view)
    const modalBodyContent = <DelegateModalBody modalView={view} vault={vault} intl={intl} />

    const modalFooterContent = (
      <div className={'flex flex-col items-center gap-6'}>
        <DelegateTxButton
          twabController={twabController as Address}
          vault={vault}
          modalView={view}
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
