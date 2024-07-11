import {
  useAllUserVaultBalances,
  useAllUserVaultDelegationBalances,
  usePrizeDrawWinners,
  useSelectedVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { CaptchaModal } from '@shared/react-components'
import { toast } from '@shared/ui'
import { getDiscordInvite } from '@shared/utilities'
import classNames from 'classnames'
import * as fathom from 'fathom-client'
import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'
import Head from 'next/head'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { trackDeposit } from 'src/utils'
import { useAccount } from 'wagmi'
import { FATHOM_EVENTS } from '@constants/config'
import { useSelectedPrizePool } from '@hooks/useSelectedPrizePool'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'
import { useWalletId } from '@hooks/useWalletId'
import { Footer } from './Footer'
import { MigrationPopup } from './MigrationPopup'
import { CheckPrizesModal } from './Modals/CheckPrizesModal'
import { DelegateModal } from './Modals/DelegateModal'
import { DepositModal } from './Modals/DepositModal'
import { DrawModal } from './Modals/DrawModal'
import { SettingsModal } from './Modals/SettingsModal'
import { WithdrawModal } from './Modals/WithdrawModal'
import { Navbar } from './Navbar'
import { drawIdAtom } from './Prizes/PrizePoolWinners'
import { VaultListHandler } from './VaultListHandler'

interface LayoutProps {
  children: ReactNode
  className?: string
}

export const Layout = (props: LayoutProps) => {
  const { children, className } = props

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

  const { selectedPrizePool } = useSelectedPrizePool()
  const { data: draws } = usePrizeDrawWinners(selectedPrizePool!)

  const selectedDrawId = useAtomValue(drawIdAtom)
  const selectedDraw = draws?.find((draw) => draw.id === selectedDrawId)

  // NOTE: This is necessary due to hydration errors otherwise.
  const [isBrowser, setIsBrowser] = useState(false)
  useEffect(() => setIsBrowser(true), [])

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

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

  const pageTitle = pageTitles[router.pathname.split('/')[1]]

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
        prizePools={prizePoolsArray}
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
      />

      <WithdrawModal
        refetchUserBalances={refetchUserBalances}
        onSuccessfulWithdrawal={() => fathom.trackEvent(FATHOM_EVENTS.redeemed)}
      />

      <DelegateModal onSuccessfulDelegation={() => fathom.trackEvent(FATHOM_EVENTS.delegated)} />

      <DrawModal draw={selectedDraw} prizePool={selectedPrizePool} />

      <CheckPrizesModal
        prizePools={prizePoolsArray}
        onWin={() => fathom.trackEvent(FATHOM_EVENTS.checkedPrizes, { _value: 1 })}
        onNoWin={() => fathom.trackEvent(FATHOM_EVENTS.checkedPrizes, { _value: 0 })}
      />

      <CaptchaModal
        hCaptchaSiteKey='11cdabde-af7e-42cb-ba97-76e35b7f7c39'
        header={t_common('joinDiscord')}
        onVerify={getDiscordInvite}
      />

      <VaultListHandler />

      {/* TODO: remove a while after launch */}
      <MigrationPopup />

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
