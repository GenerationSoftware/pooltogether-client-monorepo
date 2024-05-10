import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useSelectedVault,
  useVaultExchangeRate
} from '@generationsoftware/hyperstructure-react-hooks'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { createWithdrawTxToast } from '@shared/react-components'
import { Modal } from '@shared/ui'
import { formatNumberForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'
import { ReactNode, useState } from 'react'
import { ConfirmingView } from './Views/ConfirmingView'
import { ErrorView } from './Views/ErrorView'
import { MainView } from './Views/MainView'
import { ReviewView } from './Views/ReviewView'
import { SuccessView } from './Views/SuccessView'
import { WaitingView } from './Views/WaitingView'
import { withdrawFormTokenAmountAtom } from './WithdrawForm'
import { WithdrawTxButton } from './WithdrawTxButton'

export type WithdrawModalView = 'main' | 'review' | 'waiting' | 'confirming' | 'success' | 'error'

export interface WithdrawModalProps {
  onClose?: () => void
  onGoToAccount?: () => void
  refetchUserBalances?: () => void
  onSuccessfulWithdrawal?: () => void
}

export const WithdrawModal = (props: WithdrawModalProps) => {
  const { onClose, onGoToAccount, refetchUserBalances, onSuccessfulWithdrawal } = props

  const t_toasts = useTranslations('Toasts.transactions')

  const addRecentTransaction = useAddRecentTransaction()

  const { vault } = useSelectedVault()

  const { isModalOpen, setIsModalOpen } = useIsModalOpen(MODAL_KEYS.withdraw, { onClose })

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
        addRecentTransaction,
        refetchUserBalances,
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
    const modalViews: Record<WithdrawModalView, ReactNode> = {
      main: <MainView vault={vault} />,
      review: <ReviewView vault={vault} />,
      waiting: <WaitingView vault={vault} closeModal={handleClose} />,
      confirming: <ConfirmingView vault={vault} txHash={withdrawTxHash} closeModal={handleClose} />,
      success: (
        <SuccessView
          vault={vault}
          txHash={withdrawTxHash}
          closeModal={handleClose}
          goToAccount={onGoToAccount}
        />
      ),
      error: <ErrorView setModalView={setView} />
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
          refetchUserBalances={refetchUserBalances}
          onSuccessfulWithdrawal={onSuccessfulWithdrawal}
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
