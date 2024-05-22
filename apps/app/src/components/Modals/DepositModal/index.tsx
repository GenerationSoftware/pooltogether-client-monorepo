import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useSelectedVault,
  useTokenPermitSupport,
  useVaultExchangeRate,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { AlertIcon, createDepositTxToast } from '@shared/react-components'
import { Modal } from '@shared/ui'
import { formatNumberForDisplay, LINKS, lower } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'
import { ReactNode, useMemo, useState } from 'react'
import { Address, TransactionReceipt } from 'viem'
import {
  depositFormShareAmountAtom,
  depositFormTokenAddressAtom,
  depositFormTokenAmountAtom
} from './DepositForm'
import { DepositTxButton } from './DepositTxButton'
import { DepositWithPermitTxButton } from './DepositWithPermitTxButton'
import { DepositZapTxButton } from './DepositZapTxButton'
import { ConfirmingView } from './Views/ConfirmingView'
import { ErrorView } from './Views/ErrorView'
import { MainView } from './Views/MainView'
import { ReviewView } from './Views/ReviewView'
import { SuccessView } from './Views/SuccessView'
import { WaitingView } from './Views/WaitingView'

export type DepositModalView = 'main' | 'review' | 'waiting' | 'confirming' | 'success' | 'error'

export interface DepositModalProps {
  prizePools: PrizePool[]
  onClose?: () => void
  refetchUserBalances?: () => void
  onSuccessfulApproval?: () => void
  onSuccessfulDeposit?: (chainId: number, txReceipt: TransactionReceipt) => void
  onSuccessfulDepositWithPermit?: (chainId: number, txReceipt: TransactionReceipt) => void
}

export const DepositModal = (props: DepositModalProps) => {
  const {
    prizePools,
    onClose,
    refetchUserBalances,
    onSuccessfulApproval,
    onSuccessfulDeposit,
    onSuccessfulDepositWithPermit
  } = props

  const t_toasts = useTranslations('Toasts.transactions')

  const addRecentTransaction = useAddRecentTransaction()

  const { vault } = useSelectedVault()

  const { isModalOpen, setIsModalOpen } = useIsModalOpen(MODAL_KEYS.deposit, { onClose })

  const [view, setView] = useState<DepositModalView>('main')

  const [depositTxHash, setDepositTxHash] = useState<string>()

  const formTokenAddress = useAtomValue(depositFormTokenAddressAtom)
  const formTokenAmount = useAtomValue(depositFormTokenAmountAtom)
  const formShareAmount = useAtomValue(depositFormShareAmountAtom)

  const { data: vaultToken } = useVaultTokenData(vault as Vault)

  const { data: tokenPermitSupport } = useTokenPermitSupport(
    vaultToken?.chainId as number,
    vaultToken?.address as Address
  )

  const { data: vaultExchangeRate } = useVaultExchangeRate(vault as Vault)

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
    const modalViews: Record<DepositModalView, ReactNode> = {
      main: <MainView vault={vault} prizePool={prizePool as PrizePool} />,
      review: <ReviewView vault={vault} prizePool={prizePool as PrizePool} />,
      waiting: <WaitingView vault={vault} closeModal={handleClose} />,
      confirming: <ConfirmingView vault={vault} txHash={depositTxHash} closeModal={handleClose} />,
      success: <SuccessView vault={vault} txHash={depositTxHash} />,
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
        {view === 'main' && !formShareAmount && <RisksDisclaimer vault={vault} />}
        {/* TODO: add support for permits on zaps */}
        {isZapping ? (
          <DepositZapTxButton
            vault={vault}
            modalView={view}
            setModalView={setView}
            setDepositTxHash={setDepositTxHash}
            refetchUserBalances={refetchUserBalances}
            onSuccessfulApproval={onSuccessfulApproval}
            onSuccessfulDeposit={onSuccessfulDeposit}
          />
        ) : tokenPermitSupport === 'eip2612' ? (
          <DepositWithPermitTxButton
            vault={vault}
            modalView={view}
            setModalView={setView}
            setDepositTxHash={setDepositTxHash}
            refetchUserBalances={refetchUserBalances}
            onSuccessfulDepositWithPermit={onSuccessfulDepositWithPermit}
          />
        ) : (
          <DepositTxButton
            vault={vault}
            modalView={view}
            setModalView={setView}
            setDepositTxHash={setDepositTxHash}
            refetchUserBalances={refetchUserBalances}
            onSuccessfulApproval={onSuccessfulApproval}
            onSuccessfulDeposit={onSuccessfulDeposit}
          />
        )}
        {view === 'review' && <DepositDisclaimer vault={vault} />}
      </div>
    ) : undefined

    return (
      <Modal
        bodyContent={modalViews[view]}
        footerContent={modalFooterContent}
        onClose={handleClose}
        label='deposit-flow'
        mobileStyle='tab'
      />
    )
  }

  return <></>
}

interface RisksDisclaimerProps {
  vault: Vault
}

const RisksDisclaimer = (props: RisksDisclaimerProps) => {
  const { vault } = props

  const t_common = useTranslations('Common')
  const t_modals = useTranslations('TxModals')

  const vaultHref = `/vault/${vault.chainId}/${vault.address}`

  return (
    <div className='w-full flex flex-col gap-4 p-6 text-pt-purple-100 bg-pt-transparent rounded-lg lg:items-center'>
      <div className='flex gap-2 items-center'>
        <AlertIcon className='w-5 h-5' />
        <span className='text-xs font-semibold lg:text-sm'>{t_common('learnAboutRisks')}</span>
      </div>
      <span className='text-xs lg:text-center lg:text-sm'>
        {t_modals.rich('risksDisclaimer', {
          vaultLink: (chunks) => <DisclaimerLink href={vaultHref}>{chunks}</DisclaimerLink>
        })}
      </span>
    </div>
  )
}

interface DepositDisclaimerProps {
  vault: Vault
}

const DepositDisclaimer = (props: DepositDisclaimerProps) => {
  const { vault } = props

  const t_modals = useTranslations('TxModals')

  const vaultHref = `/vault/${vault.chainId}/${vault.address}`

  return (
    <span className='text-xs text-pt-purple-100 px-6'>
      {t_modals.rich('depositDisclaimer', {
        tosLink: (chunks) => <DisclaimerLink href={LINKS.termsOfService}>{chunks}</DisclaimerLink>,
        vaultLink: (chunks) => <DisclaimerLink href={vaultHref}>{chunks}</DisclaimerLink>
      })}
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
