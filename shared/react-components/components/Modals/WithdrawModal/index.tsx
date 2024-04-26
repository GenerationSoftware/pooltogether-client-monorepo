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
import { withdrawFormTokenAmountAtom } from '../../Form/WithdrawForm'
import { createWithdrawTxToast, WithdrawTxToastProps } from '../../Toasts/WithdrawTxToast'
import { NetworkFeesProps } from '../NetworkFees'
import { ConfirmingView } from './Views/ConfirmingView'
import { ErrorView } from './Views/ErrorView'
import { MainView } from './Views/MainView'
import { ReviewView } from './Views/ReviewView'
import { SuccessView } from './Views/SuccessView'
import { WaitingView } from './Views/WaitingView'
import { WithdrawTxButton } from './WithdrawTxButton'

export type WithdrawModalView = 'main' | 'review' | 'waiting' | 'confirming' | 'success' | 'error'

export interface WithdrawModalProps {
  onGoToAccount?: () => void
  openConnectModal?: () => void
  openChainModal?: () => void
  addRecentTransaction?: (tx: { hash: string; description: string; confirmations?: number }) => void
  refetchUserBalances?: () => void
  onSuccessfulWithdrawal?: () => void
  intl?: {
    base?: RichIntl<
      | 'withdrawFrom'
      | 'withdrawFromShort'
      | 'max'
      | 'balance'
      | 'enterAnAmount'
      | 'reviewWithdrawal'
      | 'withdrawTx'
      | 'confirmWithdrawal'
      | 'switchNetwork'
      | 'switchingNetwork'
      | 'confirmNotice'
      | 'submissionNotice'
      | 'withdrawing'
      | 'success'
      | 'withdrew'
      | 'viewAccount'
      | 'uhOh'
      | 'failedTx'
      | 'tryAgain'
    >
    common?: Intl<'prizePool' | 'connectWallet' | 'close' | 'viewOn' | 'warning'>
    fees?: NetworkFeesProps['intl']
    txToast?: WithdrawTxToastProps['intl']
    errors?: RichIntl<
      | 'formErrors.notEnoughTokens'
      | 'formErrors.invalidNumber'
      | 'formErrors.negativeNumber'
      | 'formErrors.tooManyDecimals'
    >
  }
}

export const WithdrawModal = (props: WithdrawModalProps) => {
  const {
    onGoToAccount,
    openConnectModal,
    openChainModal,
    addRecentTransaction,
    refetchUserBalances,
    onSuccessfulWithdrawal,
    intl
  } = props

  const { vault } = useSelectedVault()

  const { isModalOpen, setIsModalOpen } = useIsModalOpen(MODAL_KEYS.withdraw)

  const [view, setView] = useState<WithdrawModalView>('main')

  const [withdrawTxHash, setWithdrawTxHash] = useState<string>()

  const formTokenAmount = useAtomValue(withdrawFormTokenAmountAtom)

  const { data: vaultExchangeRate } = useVaultExchangeRate(vault as Vault)

  const createToast = () => {
    if (!!vault && !!withdrawTxHash && view === 'confirming') {
      createWithdrawTxToast({
        vault: vault,
        txHash: withdrawTxHash,
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
    const modalViews: Record<WithdrawModalView, ReactNode> = {
      main: <MainView vault={vault} intl={intl} />,
      review: <ReviewView vault={vault} intl={intl} />,
      waiting: <WaitingView vault={vault} closeModal={handleClose} intl={intl} />,
      confirming: (
        <ConfirmingView
          vault={vault}
          txHash={withdrawTxHash}
          closeModal={handleClose}
          intl={intl}
        />
      ),
      success: (
        <SuccessView
          vault={vault}
          txHash={withdrawTxHash}
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
        <WithdrawTxButton
          vault={vault}
          modalView={view}
          setModalView={setView}
          setWithdrawTxHash={setWithdrawTxHash}
          openConnectModal={openConnectModal}
          openChainModal={openChainModal}
          addRecentTransaction={addRecentTransaction}
          refetchUserBalances={refetchUserBalances}
          onSuccessfulWithdrawal={onSuccessfulWithdrawal}
          intl={intl}
        />
      </div>
    ) : undefined

    return (
      <Modal
        bodyContent={modalViews[view]}
        footerContent={modalFooterContent}
        onClose={handleClose}
        label='withdraw-flow'
        hideHeader={true}
        mobileStyle='tab'
      />
    )
  }

  return <></>
}
