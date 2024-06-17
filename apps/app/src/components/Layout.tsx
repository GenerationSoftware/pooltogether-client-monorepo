import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useAllUserVaultBalances,
  useAllUserVaultDelegationBalances,
  usePrizeDrawWinners,
  useSelectedVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import {
  ConnectButton,
  useAddRecentTransaction,
  useChainModal,
  useConnectModal
} from '@rainbow-me/rainbowkit'
import { MODAL_KEYS, useIsModalOpen, useIsTestnets } from '@shared/generic-react-hooks'
import {
  CaptchaModal,
  CheckPrizesModal,
  DelegateModal,
  SettingsModal
} from '@shared/react-components'
import { Footer, FooterItem, Navbar, SocialIcon, toast } from '@shared/ui'
import { getDiscordInvite, LINKS, NETWORK } from '@shared/utilities'
import classNames from 'classnames'
import * as fathom from 'fathom-client'
import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'
import Head from 'next/head'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { trackDeposit } from 'src/utils'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { DEFAULT_VAULT_LISTS, FATHOM_EVENTS } from '@constants/config'
import { useNetworks } from '@hooks/useNetworks'
import { useSelectedPrizePool } from '@hooks/useSelectedPrizePool'
import { useSettingsModalView } from '@hooks/useSettingsModalView'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'
import { useWalletId } from '@hooks/useWalletId'
import { MigrationPopup } from './MigrationPopup'
import { DepositModal } from './Modals/DepositModal'
import { DrawModal } from './Modals/DrawModal'
import { WithdrawModal } from './Modals/WithdrawModal'
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
  const t_settings = useTranslations('Settings')
  const t_footer = useTranslations('Footer')
  const t_txModals = useTranslations('TxModals')
  const t_txToasts = useTranslations('Toasts.transactions')
  const t_errors = useTranslations('Error')
  const t_prizeChecking = useTranslations('Account.prizeChecking')

  const { setIsModalOpen: setIsSettingsModalOpen } = useIsModalOpen(MODAL_KEYS.settings)
  const { view: settingsModalView, setView: setSettingsModalView } = useSettingsModalView()

  const { setIsModalOpen: setIsCaptchaModalOpen } = useIsModalOpen(MODAL_KEYS.captcha)

  const supportedNetworks = useNetworks()
  const { isTestnets, setIsTestnets } = useIsTestnets()

  const customRpcNetworks = useMemo(() => {
    return [...new Set([NETWORK.mainnet, ...supportedNetworks])]
  }, [supportedNetworks])

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

  const { vaults } = useSelectedVaults()
  const { address: userAddress } = useAccount()
  const { refetch: refetchUserVaultBalances } = useAllUserVaultBalances(
    vaults,
    userAddress as Address,
    { refetchOnWindowFocus: true }
  )
  const { refetch: refetchUserVaultDelegationBalances } = useAllUserVaultDelegationBalances(
    vaults,
    userAddress as Address,
    { refetchOnWindowFocus: true }
  )

  const refetchUserBalances = () => {
    refetchUserVaultBalances()
    refetchUserVaultDelegationBalances()
  }

  const { selectedPrizePool } = useSelectedPrizePool()
  const { data: draws } = usePrizeDrawWinners(selectedPrizePool as PrizePool)

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

  const footerItems: FooterItem[] = [
    {
      title: t_footer('titles.getHelp'),
      content: [
        { content: t_footer('userDocs'), href: LINKS.docs },
        { content: t_footer('devDocs'), href: LINKS.protocolDevDocs }
      ]
    },
    {
      title: t_footer('titles.ecosystem'),
      content: [
        { content: t_footer('extensions'), href: LINKS.ecosystem },
        { content: t_footer('governance'), href: LINKS.governance },
        { content: t_footer('security'), href: LINKS.audits }
      ]
    },
    {
      title: t_footer('titles.community'),
      content: [
        {
          content: 'Twitter',
          href: LINKS.twitter,
          icon: <SocialIcon platform='twitter' className='w-6 h-auto shrink-0' />
        },
        {
          content: 'Discord',
          onClick: () => setIsCaptchaModalOpen(true),
          icon: <SocialIcon platform='discord' className='w-6 h-auto shrink-0' />
        },
        {
          content: 'GitHub',
          href: LINKS.github,
          icon: <SocialIcon platform='github' className='w-6 h-auto shrink-0' />
        },
        {
          content: 'Medium',
          href: LINKS.medium,
          icon: <SocialIcon platform='medium' className='w-6 h-auto shrink-0' />
        }
      ]
    },
    {
      title: t_footer('titles.settings'),
      content: [
        {
          content: t_settings('changeCurrency'),
          onClick: () => {
            setSettingsModalView('currency')
            setIsSettingsModalOpen(true)
          }
        },
        {
          content: t_settings('changeLanguage'),
          onClick: () => {
            setSettingsModalView('language')
            setIsSettingsModalOpen(true)
          }
        }
      ]
    }
  ]

  if (isBrowser) {
    footerItems[footerItems.length - 1].content.push({
      content: isTestnets ? t_footer('disableTestnets') : t_footer('enableTestnets'),
      onClick: () => {
        setIsTestnets(!isTestnets)
        router.reload()
      }
    })
  }

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

      <Navbar
        links={[
          { href: '/prizes', name: t_nav('prizes') },
          { href: '/vaults', name: t_nav('vaults') },
          { href: '/account', name: t_nav('account') }
        ]}
        activePage={router.pathname}
        // @ts-ignore
        linksAs={Link}
        append={
          <ConnectButton
            showBalance={false}
            chainStatus={{ smallScreen: 'icon', largeScreen: 'full' }}
            accountStatus='full'
          />
        }
        onClickSettings={() => setIsSettingsModalOpen(true)}
        intl={{ home: t_nav('home') }}
        className='font-grotesk'
        linkClassName='hover:text-pt-purple-200'
      />

      <SettingsModal
        view={settingsModalView}
        setView={setSettingsModalView}
        reloadPage={() => router.reload()}
        locales={['en', 'de', 'ru', 'ko', 'uk', 'hi', 'es']}
        localVaultLists={DEFAULT_VAULT_LISTS}
        supportedNetworks={customRpcNetworks}
        onCurrencyChange={() => fathom.trackEvent(FATHOM_EVENTS.changedCurrency)}
        onLanguageChange={() => fathom.trackEvent(FATHOM_EVENTS.changedLanguage)}
        onVaultListImport={() => fathom.trackEvent(FATHOM_EVENTS.importedVaultList)}
        onRpcChange={() => fathom.trackEvent(FATHOM_EVENTS.changedRPC)}
        intl={{ base: t_settings, errors: t_errors }}
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

      <DelegateModal
        openConnectModal={openConnectModal}
        openChainModal={openChainModal}
        addRecentTransaction={addRecentTransaction}
        onSuccessfulDelegation={() => fathom.trackEvent(FATHOM_EVENTS.delegated)}
        intl={{ base: t_txModals, common: t_common, txToast: t_txToasts, errors: t_errors }}
      />

      <DrawModal draw={selectedDraw} prizePool={selectedPrizePool} />

      <CheckPrizesModal
        prizePools={prizePoolsArray}
        onGoToAccount={() => router.push('/account')}
        onWin={() => fathom.trackEvent(FATHOM_EVENTS.checkedPrizes, { _value: 1 })}
        onNoWin={() => fathom.trackEvent(FATHOM_EVENTS.checkedPrizes, { _value: 0 })}
        intl={t_prizeChecking}
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

      <Footer
        items={footerItems}
        className='bg-pt-purple-600'
        containerClassName='max-w-6xl'
        titleClassName='text-pt-teal-dark'
      />
    </div>
  )
}
