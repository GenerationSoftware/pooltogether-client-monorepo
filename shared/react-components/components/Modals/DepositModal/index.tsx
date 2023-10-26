import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useSelectedVault,
  useTokenPermitSupport,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { Intl, RichIntl } from '@shared/types'
import { LINKS, Modal } from '@shared/ui'
import { formatNumberForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { ReactNode, useMemo, useState } from 'react'
import { Address } from 'viem'
import { depositFormShareAmountAtom, depositFormTokenAmountAtom } from '../../Form/DepositForm'
import { AlertIcon } from '../../Icons/AlertIcon'
import { createDepositTxToast, DepositTxToastProps } from '../../Toasts/DepositTxToast'
import { NetworkFeesProps } from '../NetworkFees'
import { DepositTxButton } from './DepositTxButton'
import { DepositWithPermitTxButton } from './DepositWithPermitTxButton'
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
      | 'weeklyChances'
      | 'oneInXChance'
      | 'max'
      | 'balance'
      | 'enterAnAmount'
      | 'approvalButton'
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
      | 'shareWarpcast'
      | 'shareHey'
      | 'viewAccount'
      | 'uhOh'
      | 'failedTx'
      | 'tryAgain'
      | 'risksDisclaimer'
      | 'depositDisclaimer'
    >
    common?: Intl<'prizePool' | 'connectWallet' | 'close' | 'viewOn' | 'learnAboutRisks'>
    fees?: NetworkFeesProps['intl']
    tooltips?: Intl<'exactApproval' | 'infiniteApproval'>
    txToast?: DepositTxToastProps['intl']
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

  const formShareAmount = useAtomValue(depositFormShareAmountAtom)
  const formTokenAmount = useAtomValue(depositFormTokenAmountAtom)

  const { data: tokenData } = useVaultTokenData(vault as Vault)

  const { data: tokenPermitSupport } = useTokenPermitSupport(
    tokenData?.chainId as number,
    tokenData?.address as Address
  )

  const prizePool = useMemo(() => {
    if (!!vault) {
      return prizePools.find((prizePool) => prizePool.chainId === vault.chainId)
    }
  }, [prizePools, vault])

  const createToast = () => {
    if (!!vault && !!depositTxHash && view === 'confirming') {
      createDepositTxToast({
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
            {view === 'main' && !formShareAmount && <RisksDisclaimer vault={vault} intl={intl} />}
            {tokenPermitSupport === 'eip2612' ? (
              <DepositWithPermitTxButton
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
            ) : (
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
            )}
            {view === 'review' && <DepositDisclaimer vault={vault} intl={intl?.base} />}
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

interface RisksDisclaimerProps {
  vault: Vault
  intl?: { base?: RichIntl<'risksDisclaimer'>; common?: Intl<'learnAboutRisks'> }
}

const RisksDisclaimer = (props: RisksDisclaimerProps) => {
  const { vault, intl } = props

  const vaultHref = `/vault/${vault.chainId}/${vault.address}`

  return (
    <div className='w-full flex flex-col gap-4 p-6 text-pt-purple-100 bg-pt-transparent rounded-lg lg:items-center'>
      <div className='flex gap-2 items-center'>
        <AlertIcon className='w-5 h-5' />
        <span className='text-xs font-semibold lg:text-sm'>
          {intl?.common?.('learnAboutRisks') ?? 'Learn about the risks'}
        </span>
      </div>
      <span className='text-xs lg:text-center lg:text-sm'>
        {intl?.base?.rich('risksDisclaimer', {
          vaultLink: (chunks) => <DisclaimerLink href={vaultHref}>{chunks}</DisclaimerLink>
        }) ?? (
          <>
            PoolTogether is a permissionless protocol. Prize vaults can be deployed by anyone. Make
            sure you know what you are depositing into.{' '}
            <DisclaimerLink href={vaultHref}>Learn more about this prize vault.</DisclaimerLink>
          </>
        )}
      </span>
    </div>
  )
}

interface DepositDisclaimerProps {
  vault: Vault
  intl?: RichIntl<'depositDisclaimer'>
}

const DepositDisclaimer = (props: DepositDisclaimerProps) => {
  const { vault, intl } = props

  const vaultHref = `/vault/${vault.chainId}/${vault.address}`

  return (
    <span className='text-xs text-pt-purple-100 px-6'>
      {intl?.rich('depositDisclaimer', {
        tosLink: (chunks) => <DisclaimerLink href={LINKS.termsOfService}>{chunks}</DisclaimerLink>,
        vaultLink: (chunks) => <DisclaimerLink href={vaultHref}>{chunks}</DisclaimerLink>
      }) ?? (
        <>
          By clicking "Confirm Deposit", you agree to Cabana's{' '}
          <DisclaimerLink href={LINKS.termsOfService}>Terms of Service</DisclaimerLink>. Click{' '}
          <DisclaimerLink href={vaultHref}>here</DisclaimerLink> to learn more about the vault
          you're depositing into.
        </>
      )}
    </span>
  )
}

interface DisclaimerLinkProps {
  href: string
  children: ReactNode
}

const DisclaimerLink = (props: DisclaimerLinkProps) => {
  const { href, children } = props

  return (
    <a href={href} target='_blank' className='text-pt-purple-300'>
      {children}
    </a>
  )
}
