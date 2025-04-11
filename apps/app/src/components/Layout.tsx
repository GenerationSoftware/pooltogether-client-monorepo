import {
  useAllUserVaultBalances,
  useAllUserVaultDelegationBalances,
  useSelectedVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { CaptchaModal } from '@shared/react-components'
import { toast } from '@shared/ui'
import { getDiscordInvite } from '@shared/utilities'
import classNames from 'classnames'
import * as fathom from 'fathom-client'
import { useTranslations } from 'next-intl'
import Head from 'next/head'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { trackDeposit } from 'src/utils'
import { useAccount } from 'wagmi'
import { FATHOM_EVENTS } from '@constants/config'
import { useWalletId } from '@hooks/useWalletId'
import { Footer } from './Footer'
import { CheckPrizesModal } from './Modals/CheckPrizesModal'
import { DelegateModal } from './Modals/DelegateModal'
import { DepositModal } from './Modals/DepositModal'
import { SettingsModal } from './Modals/SettingsModal'
import { WithdrawModal } from './Modals/WithdrawModal'
import { Navbar } from './Navbar'
import { VaultListHandler } from './VaultListHandler'

interface LayoutProps {
  children: ReactNode
  overrides?: { pageTitle?: string }
  className?: string
}

export const Layout = (props: LayoutProps) => {
  const { children, overrides, className } = props

  const router = useRouter()

  const t_common = useTranslations('Common')
  const t_nav = useTranslations('Navigation')

  const { vaults } = useSelectedVaults()
  const { address: userAddress } = useAccount()
  const { refetch: refetchUserVaultBalances } = useAllUserVaultBalances(vaults, userAddress!, {
    refetchOnWindowFocus: true
  })
  const { refetch: refetchUserVaultDelegationBalances } = useAllUserVaultDelegationBalances(
    vaults,
    userAddress!,
    { refetchOnWindowFocus: true }
  )

  const refetchUserBalances = () => {
    refetchUserVaultBalances()
    refetchUserVaultDelegationBalances()
  }

  // NOTE: This is necessary due to hydration errors otherwise.
  const [isBrowser, setIsBrowser] = useState(false)
  useEffect(() => setIsBrowser(true), [])

  const temporaryAlerts: { id: string; content: ReactNode }[] = []

  useEffect(() => {
    temporaryAlerts.forEach((alert) => {
      toast(alert.content, { id: alert.id })
    })
  })

  const searchParams = useSearchParams()
  const { walletId, setWalletId } = useWalletId()

  useEffect(() => {
    if (!!searchParams) {
      const utmSrc = searchParams.get('utm_source')?.toLowerCase()

      if (!!utmSrc) {
        if (utmSrc === 'imtoken') {
          setWalletId('imToken')
        } else if (utmSrc === 'exodus') {
          setWalletId('exodus')
        }
      }
    }
  }, [searchParams])

  const pageTitles: { [href: string]: string } = {
    account: t_nav('account'),
    prizes: t_nav('prizes'),
    vaults: t_nav('vaults'),
    vault: t_nav('vault')
  }

  const pageTitle = overrides?.pageTitle ?? pageTitles[router.pathname.split('/')[1]]

  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>{`Cabana App${!!pageTitle ? ` | ${pageTitle}` : ''}`}</title>
      </Head>

      <Navbar />

      <SettingsModal
        locales={['en', 'de', 'ru', 'ko', 'uk', 'hi', 'es']}
        onCurrencyChange={() => fathom.trackEvent(FATHOM_EVENTS.changedCurrency)}
        onLanguageChange={() => fathom.trackEvent(FATHOM_EVENTS.changedLanguage)}
        onVaultListImport={() => fathom.trackEvent(FATHOM_EVENTS.importedVaultList)}
        onRpcChange={() => fathom.trackEvent(FATHOM_EVENTS.changedRPC)}
      />

      <DepositModal
        refetchUserBalances={refetchUserBalances}
        onSuccessfulApproval={() => fathom.trackEvent(FATHOM_EVENTS.approvedExact)}
        onSuccessfulDeposit={(chainId, txReceipt) => {
          fathom.trackEvent(FATHOM_EVENTS.deposited)
          !!walletId && trackDeposit(chainId, txReceipt.transactionHash, walletId)
        }}
        onSuccessfulDepositWithPermit={(chainId, txReceipt) => {
          fathom.trackEvent(FATHOM_EVENTS.depositedWithPermit)
          !!walletId && trackDeposit(chainId, txReceipt.transactionHash, walletId)
        }}
        onSuccessfulDepositWithZap={(chainId, txReceipt) => {
          fathom.trackEvent(FATHOM_EVENTS.depositedWithZap)
          !!walletId && trackDeposit(chainId, txReceipt.transactionHash, walletId)
        }}
        onSuccessfulDepositWithEip5792={(chainId, txReceipt) => {
          fathom.trackEvent(FATHOM_EVENTS.depositedWithEip5792)
          !!walletId && trackDeposit(chainId, txReceipt.transactionHash, walletId)
        }}
        onSuccessfulDepositWithEip5792AndZap={(chainId, txReceipt) => {
          fathom.trackEvent(FATHOM_EVENTS.depositedWithEip5792AndZap)
          !!walletId && trackDeposit(chainId, txReceipt.transactionHash, walletId)
        }}
      />

      <WithdrawModal
        refetchUserBalances={refetchUserBalances}
        onSuccessfulApproval={() => fathom.trackEvent(FATHOM_EVENTS.approvedExact)}
        onSuccessfulWithdrawal={() => fathom.trackEvent(FATHOM_EVENTS.redeemed)}
        onSuccessfulWithdrawalWithZap={() => fathom.trackEvent(FATHOM_EVENTS.redeemedWithZap)}
        onSuccessfulWithdrawalWithEip5792={() =>
          fathom.trackEvent(FATHOM_EVENTS.redeemedWithEip5792)
        }
        onSuccessfulWithdrawalWithEip5792AndZap={() =>
          fathom.trackEvent(FATHOM_EVENTS.redeemedWithEip5792AndZap)
        }
      />

      <DelegateModal onSuccessfulDelegation={() => fathom.trackEvent(FATHOM_EVENTS.delegated)} />

      <CheckPrizesModal
        onWin={() => fathom.trackEvent(FATHOM_EVENTS.checkedPrizes, { _value: 1 })}
        onNoWin={() => fathom.trackEvent(FATHOM_EVENTS.checkedPrizes, { _value: 0 })}
      />

      <CaptchaModal
        hCaptchaSiteKey='11cdabde-af7e-42cb-ba97-76e35b7f7c39'
        header={t_common('joinDiscord')}
        onVerify={getDiscordInvite}
      />

      <VaultListHandler />

      <main
        className={classNames(
          'w-full max-w-screen-xl min-h-[90vh] relative flex flex-col flex-grow items-center mx-auto px-4 py-8 mb-40 md:px-8',
          className
        )}
      >
        {isBrowser && router.isReady && <>{children}</>}
      </main>

      <Footer />
    </div>
  )
}
