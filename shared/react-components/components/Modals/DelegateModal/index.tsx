import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useSelectedVault,
  useVaultExchangeRate
} from '@generationsoftware/hyperstructure-react-hooks'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { Intl, RichIntl } from '@shared/types'
import { Modal } from '@shared/ui'
import { formatNumberForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { ReactNode, useState } from 'react'
import { delegateFormTokenAmountAtom } from '../../Form/DelegateForm'
import { createDelegateTxToast, DelegateTxToastProps } from '../../Toasts/DelegateTxToast'
import { NetworkFeesProps } from '../NetworkFees'
import { DelegateTxButton } from './DelegateTxButton'
import { ConfirmingView } from './Views/ConfirmingView'
import { ErrorView } from './Views/ErrorView'
import { MainView } from './Views/MainView'
import { ReviewView } from './Views/ReviewView'
import { SuccessView } from './Views/SuccessView'
import { WaitingView } from './Views/WaitingView'

export type DelegateModalView = 'main' | 'review' | 'waiting' | 'confirming' | 'success' | 'error'

export interface DelegateModalProps {
  onGoToAccount?: () => void
  openConnectModal?: () => void
  openChainModal?: () => void
  addRecentTransaction?: (tx: { hash: string; description: string; confirmations?: number }) => void
  refetchUserBalances?: () => void
  onSuccessfulDelegation?: () => void
  intl?: {
    base?: RichIntl<
      | 'delegateFrom'
      | 'delegateFromShort'
      | 'max'
      | 'balance'
      | 'enterAnAmount'
      | 'reviewWithdrawal'
      | 'delegateTx'
      | 'confirmDelegation'
      | 'switchNetwork'
      | 'switchingNetwork'
      | 'confirmNotice'
      | 'submissionNotice'
      | 'withdrawing'
      | 'success'
      | 'delegated'
      | 'viewAccount'
      | 'uhOh'
      | 'failedTx'
      | 'tryAgain'
    >
    common?: Intl<'prizePool' | 'connectWallet' | 'close' | 'viewOn' | 'warning'>
    fees?: NetworkFeesProps['intl']
    txToast?: DelegateTxToastProps['intl']
    errors?: RichIntl<
      | 'exchangeRateError'
      | 'aaveCollateralizationError.issue'
      | 'aaveCollateralizationError.recommendation'
      | 'aaveCollateralizationError.moreInfo'
      | 'formErrors.notEnoughTokens'
      | 'formErrors.invalidNumber'
      | 'formErrors.negativeNumber'
      | 'formErrors.tooManyDecimals'
    >
  }
}

export const DelegateModal = (props: DelegateModalProps) => {
  const {
    onGoToAccount,
    openConnectModal,
    openChainModal,
    addRecentTransaction,
    refetchUserBalances,
    onSuccessfulDelegation,
    intl
  } = props

  const { vault } = useSelectedVault()

  const { isModalOpen, setIsModalOpen } = useIsModalOpen(MODAL_KEYS.delegate)

  const [view, setView] = useState<DelegateModalView>('main')

  const [delegateTxHash, setDelegateTxHash] = useState<string>()

  const formTokenAmount = useAtomValue(delegateFormTokenAmountAtom)

  const { data: vaultExchangeRate } = useVaultExchangeRate(vault as Vault)

  const createToast = () => {
    if (!!vault && !!delegateTxHash && view === 'confirming') {
      createDelegateTxToast({
        vault: vault,
        txHash: delegateTxHash,
        formattedAmount: formatNumberForDisplay(formTokenAmount),
        addRecentTransaction: addRecentTransaction,
        refetchUserBalances: refetchUserBalances,
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
    const modalViews: Record<DelegateModalView, ReactNode> = {
      main: <MainView vault={vault} intl={intl} />,
      review: <ReviewView vault={vault} intl={intl} />,
      waiting: <WaitingView vault={vault} closeModal={handleClose} intl={intl} />,
      confirming: (
        <ConfirmingView
          vault={vault}
          txHash={delegateTxHash}
          closeModal={handleClose}
          intl={intl}
        />
      ),
      success: (
        <SuccessView
          vault={vault}
          txHash={delegateTxHash}
          closeModal={handleClose}
          goToAccount={onGoToAccount}
          intl={intl}
        />
      ),
      error: <ErrorView setModalView={setView} intl={intl?.base} />
    }

    const modalFooterContent = !!vaultExchangeRate ? (
      <div
        className={classNames('flex flex-col items-center gap-6', {
          hidden: view !== 'main' && view !== 'review'
        })}
      >
        <DelegateTxButton
          vault={vault}
          modalView={view}
          setModalView={setView}
          setDelegateTxHash={setDelegateTxHash}
          openConnectModal={openConnectModal}
          openChainModal={openChainModal}
          addRecentTransaction={addRecentTransaction}
          refetchUserBalances={refetchUserBalances}
          onSuccessfulDelegation={onSuccessfulDelegation}
          intl={intl}
        />
      </div>
    ) : undefined

    return (
      <Modal
        bodyContent={modalViews[view]}
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
