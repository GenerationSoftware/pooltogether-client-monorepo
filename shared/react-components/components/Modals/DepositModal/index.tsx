import { formatNumberForDisplay, PrizePool } from '@pooltogether/hyperstructure-client-js'
import { useSelectedVault } from '@pooltogether/hyperstructure-react-hooks'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { Intl, RichIntl } from '@shared/types'
import { LINKS, Modal } from '@shared/ui'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { ReactNode, useMemo, useState } from 'react'
import { depositFormTokenAmountAtom } from '../../Form/DepositForm'
import { createTxToast, TransactionToastProps } from '../../Toasts/TransactionToast'
import { NetworkFeesProps } from '../NetworkFees'
import { DepositTxButton } from './DepositTxButton'
import { ConfirmingView } from './Views/ConfirmingView'
import { ErrorView } from './Views/ErrorView'
import { MainView } from './Views/MainView'
import { ReviewView } from './Views/ReviewView'
import { SuccessView } from './Views/SuccessView'
import { WaitingView } from './Views/WaitingView'

export type DepositModalView = 'main' | 'review' | 'waiting' | 'confirming' | 'success' | 'error'

export interface DepositModalProps {
  prizePools: PrizePool[]
  onGoToAccount?: () => void
  openConnectModal?: () => void
  openChainModal?: () => void
  addRecentTransaction?: (tx: { hash: string; description: string; confirmations?: number }) => void
  refetchUserBalances?: () => void
  intl?: {
    base?: RichIntl<
      | 'depositTo'
      | 'depositToShort'
      | 'dailyChances'
      | 'oneInXChance'
      | 'max'
      | 'balance'
      | 'enterAnAmount'
      | 'exactApprovalButton'
      | 'exactApprovalTx'
      | 'infiniteApprovalButton'
      | 'infiniteApprovalTx'
      | 'reviewDeposit'
      | 'confirmDeposit'
      | 'depositTx'
      | 'switchNetwork'
      | 'switchingNetwork'
      | 'confirmNotice'
      | 'submissionNotice'
      | 'depositing'
      | 'success'
      | 'deposited'
      | 'nowEligible'
      | 'shareTwitter'
      | 'shareLenster'
      | 'viewAccount'
      | 'uhOh'
      | 'failedTx'
      | 'tryAgain'
      | 'disclaimer'
    >
    common?: Intl<'prizePool' | 'connectWallet' | 'close' | 'viewOn'>
    fees?: NetworkFeesProps['intl']
    tooltips?: Intl<'exactApproval' | 'infiniteApproval'>
    txToast?: TransactionToastProps['intl']
    formErrors?: Intl<'notEnoughTokens' | 'invalidNumber' | 'negativeNumber' | 'tooManyDecimals'>
  }
}

export const DepositModal = (props: DepositModalProps) => {
  const {
    prizePools,
    onGoToAccount,
    openConnectModal,
    openChainModal,
    addRecentTransaction,
    refetchUserBalances,
    intl
  } = props

  const { vault } = useSelectedVault()

  const { isModalOpen, setIsModalOpen } = useIsModalOpen(MODAL_KEYS.deposit)

  const [view, setView] = useState<DepositModalView>('main')

  const [depositTxHash, setDepositTxHash] = useState<string>()

  const formTokenAmount = useAtomValue(depositFormTokenAmountAtom)

  const prizePool = useMemo(() => {
    if (!!vault) {
      return prizePools.find((prizePool) => prizePool.chainId === vault.chainId)
    }
  }, [prizePools, vault])

  const createToast = () => {
    if (!!vault && !!depositTxHash && view === 'confirming') {
      createTxToast({
        type: 'deposit',
        vault: vault,
        txHash: depositTxHash,
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
    const modalViews: Record<DepositModalView, ReactNode> = {
      main: <MainView vault={vault} prizePool={prizePool as PrizePool} intl={intl} />,
      review: <ReviewView vault={vault} prizePool={prizePool as PrizePool} intl={intl} />,
      waiting: <WaitingView vault={vault} closeModal={handleClose} intl={intl} />,
      confirming: (
        <ConfirmingView vault={vault} txHash={depositTxHash} closeModal={handleClose} intl={intl} />
      ),
      success: (
        <SuccessView
          vault={vault}
          txHash={depositTxHash}
          closeModal={handleClose}
          goToAccount={onGoToAccount}
          intl={intl}
        />
      ),
      error: <ErrorView setModalView={setView} intl={intl?.base} />
    }

    return (
      <Modal
        bodyContent={modalViews[view]}
        footerContent={
          <div
            className={classNames('flex flex-col items-center gap-6', {
              hidden: view !== 'main' && view !== 'review'
            })}
          >
            <DepositTxButton
              vault={vault}
              modalView={view}
              setModalView={setView}
              setDepositTxHash={setDepositTxHash}
              openConnectModal={openConnectModal}
              openChainModal={openChainModal}
              addRecentTransaction={addRecentTransaction}
              refetchUserBalances={refetchUserBalances}
              intl={intl}
            />
            {view === 'review' && <DepositDisclaimer intl={intl?.base} />}
          </div>
        }
        onClose={handleClose}
        label='deposit-flow'
        hideHeader={true}
        mobileStyle='tab'
      />
    )
  }

  return <></>
}

interface DepositDisclaimerProps {
  intl?: RichIntl<'disclaimer'>
}

const DepositDisclaimer = (props: DepositDisclaimerProps) => {
  const { intl } = props

  return (
    <span className='text-xs text-pt-purple-100 px-6'>
      {intl?.rich('disclaimer', {
        tosLink: (chunks) => <ToSLink>{chunks}</ToSLink>,
        disLink: (chunks) => <PDLink>{chunks}</PDLink>
      }) ??
        `By clicking "Confirm Deposit", you agree to PoolTogether's ${(
          <ToSLink>Terms of Service</ToSLink>
        )} and acknowledge that you have read and understand the PoolTogether ${(
          <PDLink>protocol disclaimer</PDLink>
        )}.`}
    </span>
  )
}

const ToSLink = (props: { children: ReactNode }) => (
  <a href={LINKS.termsOfService} target='_blank' className='text-pt-teal-dark'>
    {props.children}
  </a>
)

const PDLink = (props: { children: ReactNode }) => (
  <a href={LINKS.protocolDisclaimer} target='_blank' className='text-pt-teal-dark'>
    {props.children}
  </a>
)
