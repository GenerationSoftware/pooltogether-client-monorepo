import { isNewerVersion, PrizePool } from '@pooltogether/hyperstructure-client-js'
import {
  useAllUserVaultBalances,
  useCachedVaultLists,
  usePrizeDrawWinners,
  useSelectedVaultListIds,
  useSelectedVaults
} from '@pooltogether/hyperstructure-react-hooks'
import {
  ConnectButton,
  useAddRecentTransaction,
  useChainModal,
  useConnectModal
} from '@rainbow-me/rainbowkit'
import { MODAL_KEYS, useIsModalOpen, useIsTestnets } from '@shared/generic-react-hooks'
import {
  CaptchaModal,
  DepositModal,
  DrawModal,
  SettingsModal,
  SettingsModalView,
  WithdrawModal
} from '@shared/react-components'
import { Footer, FooterItem, LINKS, Navbar, SocialIcon, Toaster } from '@shared/ui'
import { getDiscordInvite } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { DEFAULT_VAULT_LISTS } from '@constants/config'
import { useSelectedPrizePool } from '@hooks/useSelectedPrizePool'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'
import { drawIdAtom } from './Prizes/PrizePoolWinners'

interface LayoutProps {
  children: ReactNode
  className?: string
}

export const Layout = (props: LayoutProps) => {
  const { children, className } = props

  const router = useRouter()

  const { setIsModalOpen: setIsSettingsModalOpen } = useIsModalOpen(MODAL_KEYS.settings)
  const [settingsModalView, setSettingsModalView] = useState<SettingsModalView>('menu')

  const { setIsModalOpen: setIsCaptchaModalOpen } = useIsModalOpen(MODAL_KEYS.captcha)

  const { isTestnets, setIsTestnets } = useIsTestnets()

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

  const { cachedVaultLists, cache } = useCachedVaultLists()
  const { select } = useSelectedVaultListIds()

  const { vaults } = useSelectedVaults()
  const { address: userAddress } = useAccount()
  const { refetch: refetchUserBalances } = useAllUserVaultBalances(
    vaults,
    userAddress as `0x${string}`
  )

  const { selectedPrizePool } = useSelectedPrizePool()
  const { data: draws } = usePrizeDrawWinners(selectedPrizePool as PrizePool)

  const selectedDrawId = useAtomValue(drawIdAtom)
  const selectedDraw = draws?.find((draw) => draw.id === selectedDrawId)

  useEffect(() => {
    for (const key in DEFAULT_VAULT_LISTS) {
      const defaultVaultList = DEFAULT_VAULT_LISTS[key as keyof typeof DEFAULT_VAULT_LISTS]
      const cachedVaultList = cachedVaultLists[key]
      if (!cachedVaultList || isNewerVersion(defaultVaultList.version, cachedVaultList.version)) {
        cache(key, defaultVaultList)
        select(key, 'local')
      }
    }
  }, [])

  // NOTE: This is necessary due to hydration errors otherwise.
  const [isBrowser, setIsBrowser] = useState(false)
  useEffect(() => setIsBrowser(true), [])

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const footerItems: FooterItem[] = [
    {
      title: 'Get Help',
      content: [
        { content: 'User Docs', href: LINKS.docs },
        { content: 'FAQ', href: LINKS.faq },
        { content: 'Developer Docs', href: LINKS.devDocs }
      ]
    },
    {
      title: 'Ecosystem',
      content: [
        { content: 'Extensions', href: '/extensions' },
        { content: 'Governance', href: LINKS.governance },
        { content: 'Security', href: LINKS.audits }
      ]
    },
    {
      title: 'Community',
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
      title: 'Settings',
      content: [
        {
          content: 'Change Currency',
          onClick: () => {
            setSettingsModalView('currency')
            setIsSettingsModalOpen(true)
          }
        },
        {
          content: 'Change Language',
          onClick: () => {
            setSettingsModalView('language')
            setIsSettingsModalOpen(true)
          },
          disabled: true
        }
      ]
    }
  ]

  if (isBrowser) {
    footerItems[footerItems.length - 1].content.push({
      content: `${isTestnets ? 'Disable' : 'Enable'} Testnets`,
      onClick: () => setIsTestnets(!isTestnets)
    })
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar
        links={[
          { href: '/prizes', name: 'Prizes' },
          { href: '/vaults', name: 'Vaults' },
          { href: '/account', name: 'Account' }
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
        linkClassName='hover:text-pt-purple-200'
      />

      <SettingsModal
        view={settingsModalView}
        setView={setSettingsModalView}
        localVaultLists={DEFAULT_VAULT_LISTS}
        disable={['language']}
      />

      <DepositModal
        prizePools={prizePoolsArray}
        openConnectModal={openConnectModal}
        openChainModal={openChainModal}
        addRecentTransaction={addRecentTransaction}
        onGoToAccount={() => router.push('/account')}
        refetchUserBalances={refetchUserBalances}
      />

      <WithdrawModal
        openConnectModal={openConnectModal}
        openChainModal={openChainModal}
        addRecentTransaction={addRecentTransaction}
        onGoToAccount={() => router.push('/account')}
        refetchUserBalances={refetchUserBalances}
      />

      <DrawModal draw={selectedDraw} prizePool={selectedPrizePool} />

      <CaptchaModal
        hCaptchaSiteKey='11cdabde-af7e-42cb-ba97-76e35b7f7c39'
        header='Join our Discord Community'
        onVerify={getDiscordInvite}
      />

      <Toaster />

      <main
        className={classNames(
          'w-full max-w-screen-xl relative flex flex-col flex-grow items-center mx-auto px-4 py-8 mb-40 md:px-8',
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
