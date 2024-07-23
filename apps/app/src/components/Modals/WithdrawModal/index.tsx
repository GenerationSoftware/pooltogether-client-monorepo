import {
  useSelectedVault,
  useVaultExchangeRate,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { createWithdrawTxToast } from '@shared/react-components'
import { Modal } from '@shared/ui'
import { lower } from '@shared/utilities'
import classNames from 'classnames'
import { useAtom, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { ReactNode, useState } from 'react'
import { TransactionReceipt } from 'viem'
import { ConfirmingView } from './Views/ConfirmingView'
import { ErrorView } from './Views/ErrorView'
import { MainView } from './Views/MainView'
import { ReviewView } from './Views/ReviewView'
import { SuccessView } from './Views/SuccessView'
import { WaitingView } from './Views/WaitingView'
import {
  withdrawFormShareAmountAtom,
  withdrawFormTokenAddressAtom,
  withdrawFormTokenAmountAtom
} from './WithdrawForm'
import { WithdrawTxButton } from './WithdrawTxButton'
import { WithdrawZapTxButton } from './WithdrawZapTxButton'

export type WithdrawModalView = 'main' | 'review' | 'waiting' | 'confirming' | 'success' | 'error'

export interface WithdrawModalProps {
  onClose?: () => void
  refetchUserBalances?: () => void
  onSuccessfulApproval?: () => void
  onSuccessfulWithdrawal?: () => void
  onSuccessfulWithdrawalWithZap?: (chainId: number, txReceipt: TransactionReceipt) => void
}

export const WithdrawModal = (props: WithdrawModalProps) => {
  const {
    onClose,
    refetchUserBalances,
    onSuccessfulApproval,
    onSuccessfulWithdrawal,
    onSuccessfulWithdrawalWithZap
  } = props

  const t_toasts = useTranslations('Toasts.transactions')

  const addRecentTransaction = useAddRecentTransaction()

  const { vault } = useSelectedVault()

  const { isModalOpen, setIsModalOpen } = useIsModalOpen(MODAL_KEYS.withdraw, { onClose })

  const [view, setView] = useState<WithdrawModalView>('main')

  const [withdrawTxHash, setWithdrawTxHash] = useState<string>()

  const setFormShareAmount = useSetAtom(withdrawFormShareAmountAtom)
  const [formTokenAddress, setFormTokenAddress] = useAtom(withdrawFormTokenAddressAtom)
  const setFormTokenAmount = useSetAtom(withdrawFormTokenAmountAtom)

  const { data: vaultToken } = useVaultTokenData(vault!)

  const { data: vaultExchangeRate } = useVaultExchangeRate(vault!)

  const createToast = () => {
    if (!!vault && !!withdrawTxHash && view === 'confirming') {
      createWithdrawTxToast({
        vault: vault,
        txHash: withdrawTxHash,
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
    setFormShareAmount('')
    setFormTokenAddress(undefined)
    setFormTokenAmount('')
  }

  if (isModalOpen && !!vault) {
    const modalViews: Record<WithdrawModalView, ReactNode> = {
      main: <MainView vault={vault} />,
      review: <ReviewView vault={vault} />,
      waiting: <WaitingView vault={vault} closeModal={handleClose} />,
      confirming: <ConfirmingView vault={vault} txHash={withdrawTxHash} closeModal={handleClose} />,
      success: <SuccessView vault={vault} txHash={withdrawTxHash} closeModal={handleClose} />,
      error: <ErrorView setModalView={setView} />
    }

    const isZapping =
      !!vaultToken && !!formTokenAddress && lower(vaultToken.address) !== lower(formTokenAddress)

    const modalFooterContent = !!vaultExchangeRate ? (
      <div
        className={classNames('flex flex-col items-center gap-6', {
          hidden: view !== 'main' && view !== 'review'
        })}
      >
        {isZapping ? (
          <WithdrawZapTxButton
            vault={vault}
            modalView={view}
            setModalView={setView}
            setWithdrawTxHash={setWithdrawTxHash}
            refetchUserBalances={refetchUserBalances}
            onSuccessfulApproval={onSuccessfulApproval}
            onSuccessfulWithdrawalWithZap={onSuccessfulWithdrawalWithZap}
          />
        ) : (
          <WithdrawTxButton
            vault={vault}
            modalView={view}
            setModalView={setView}
            setWithdrawTxHash={setWithdrawTxHash}
            refetchUserBalances={refetchUserBalances}
            onSuccessfulWithdrawal={onSuccessfulWithdrawal}
          />
        )}
      </div>
    ) : undefined

    return (
      <Modal
        bodyContent={modalViews[view]}
        footerContent={modalFooterContent}
        onClose={handleClose}
        label='withdraw-flow'
        mobileStyle='tab'
        className='isolate'
        bodyClassName='z-10'
      />
    )
  }

  return <></>
}
