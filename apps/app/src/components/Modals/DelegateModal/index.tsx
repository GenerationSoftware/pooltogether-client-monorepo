import {
  useSelectedVault,
  useVaultTwabController
} from '@generationsoftware/hyperstructure-react-hooks'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { createDelegateTxToast } from '@shared/react-components'
import { Modal } from '@shared/ui'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { DelegateModalBody } from './DelegateModalBody'
import { DelegateTxButton } from './DelegateTxButton'

export type DelegateModalView = 'main' | 'waiting' | 'confirming' | 'success' | 'error'

export interface DelegateModalProps {
  onClose?: () => void
  onSuccessfulDelegation?: () => void
}

export const DelegateModal = (props: DelegateModalProps) => {
  const { onClose, onSuccessfulDelegation } = props

  const t_toasts = useTranslations('Toasts.transactions')

  const addRecentTransaction = useAddRecentTransaction()

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
        intl: t_toasts
      })
    }
  }

  const handleClose = () => {
    createToast()
    setIsModalOpen(false)
    setView('main')
  }

  if (isModalOpen && !!vault) {
    const modalBodyContent = <DelegateModalBody modalView={view} vault={vault} />

    const modalFooterContent = (
      <div className={'flex flex-col items-center gap-6'}>
        <DelegateTxButton
          twabController={twabController!}
          vault={vault}
          setModalView={setView}
          setDelegateTxHash={setDelegateTxHash}
          onSuccessfulDelegation={onSuccessfulDelegation}
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
