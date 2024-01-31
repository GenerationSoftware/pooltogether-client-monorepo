import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useSelectedVault,
  useVaultTwabController
} from '@generationsoftware/hyperstructure-react-hooks'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { Intl, RichIntl } from '@shared/types'
import { Modal } from '@shared/ui'
import { useState } from 'react'
import { Address } from 'viem'
import { DelegateTxToastProps } from '../../Toasts/DelegateTxToast'
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
      | 'delegateSelfDescription'
      | 'delegatedAddress'
      | 'changeDelegateAddress'
      | 'changeDelegateAddressShort'
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
    tooltip?: Intl<'delegateDescription'>
    common?: Intl<'prizePool' | 'connectWallet' | 'close' | 'viewOn' | 'warning' | 'learnMore'>
    fees?: NetworkFeesProps['intl']
    txToast?: DelegateTxToastProps['intl']
    errors?: RichIntl<'formErrors.invalidAddress' | 'formErrors.sameAsDelegate'>
  }
}

export const DelegateModal = (props: DelegateModalProps) => {
  const { openConnectModal, openChainModal, addRecentTransaction, onSuccessfulDelegation, intl } =
    props

  const { vault } = useSelectedVault()

  const { isModalOpen, setIsModalOpen } = useIsModalOpen(MODAL_KEYS.delegate)

  const [view, setView] = useState<DelegateModalView>('main')

  const { data: twabController } = useVaultTwabController(vault as Vault)

  const handleClose = () => {
    setIsModalOpen(false)
    setView('main')
  }

  if (isModalOpen && !!vault) {
    const modalBodyContent = <DelegateModalBody modalView={view} vault={vault} intl={intl} />

    const modalFooterContent = (
      <div className={'flex flex-col items-center gap-6'}>
        <DelegateTxButton
          twabController={twabController as Address}
          vault={vault}
          modalView={view}
          setModalView={setView}
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
