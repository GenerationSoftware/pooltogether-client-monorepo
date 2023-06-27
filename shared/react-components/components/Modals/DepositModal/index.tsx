import { formatNumberForDisplay, PrizePool } from '@pooltogether/hyperstructure-client-js'
import { useSelectedVault } from '@pooltogether/hyperstructure-react-hooks'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { LINKS, Modal } from '@shared/ui'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { ReactNode, useMemo, useState } from 'react'
import { depositFormTokenAmountAtom } from '../../Form/DepositForm'
import { createTxToast } from '../../Toasts/TransactionToast'
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
}

export const DepositModal = (props: DepositModalProps) => {
  const {
    prizePools,
    onGoToAccount,
    openConnectModal,
    openChainModal,
    addRecentTransaction,
    refetchUserBalances
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
    if (!!vault && !!depositTxHash && view !== 'success' && view !== 'error') {
      createTxToast({
        type: 'deposit',
        vault: vault,
        txHash: depositTxHash,
        formattedAmount: formatNumberForDisplay(formTokenAmount),
        addRecentTransaction: addRecentTransaction,
        refetchUserBalances: refetchUserBalances
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
      main: <MainView vault={vault} prizePool={prizePool as PrizePool} />,
      review: <ReviewView vault={vault} prizePool={prizePool as PrizePool} />,
      waiting: <WaitingView vault={vault} closeModal={handleClose} />,
      confirming: <ConfirmingView vault={vault} txHash={depositTxHash} closeModal={handleClose} />,
      success: (
        <SuccessView
          vault={vault}
          txHash={depositTxHash}
          closeModal={handleClose}
          goToAccount={onGoToAccount}
        />
      ),
      error: <ErrorView setModalView={setView} />
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
            />
            {view === 'review' && <DepositDisclaimer />}
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

const DepositDisclaimer = () => {
  return (
    <span className='text-xs text-pt-purple-100 px-6'>
      By clicking "Confirm Deposit", you agree to PoolTogether's{' '}
      <a href={LINKS.termsOfService} target='_blank' className='text-pt-teal-dark'>
        Terms of Service
      </a>{' '}
      and acknowledge that you have read and understand the PoolTogether{' '}
      <a href={LINKS.protocolDisclaimer} target='_blank' className='text-pt-teal-dark'>
        protocol disclaimer
      </a>
      .
    </span>
  )
}
