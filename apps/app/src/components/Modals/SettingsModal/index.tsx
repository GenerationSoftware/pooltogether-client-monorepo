import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { CURRENCY_ID, LANGUAGE_ID, MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { Modal } from '@shared/ui'
import { NETWORK } from '@shared/utilities'
import { useRouter } from 'next/router'
import { ReactNode, useMemo } from 'react'
import { useNetworks } from '@hooks/useNetworks'
import { useSettingsModalView } from '@hooks/useSettingsModalView'
import { CurrencyView } from './Views/CurrencyView'
import { LanguageView } from './Views/LanguageView'
import { MenuView } from './Views/MenuView'
import { MiscSettingsView } from './Views/MiscSettingsView'
import { RPCsView } from './Views/RPCsView'
import { VaultListView } from './Views/VaultListView'

export type SettingsModalOption = 'currency' | 'language' | 'vaultLists' | 'customRPCs' | 'misc'

export type SettingsModalView = 'menu' | SettingsModalOption

export interface SettingsModalProps {
  locales?: LANGUAGE_ID[]
  disable?: SettingsModalOption[]
  hide?: SettingsModalOption[]
  onCurrencyChange?: (id: CURRENCY_ID) => void
  onLanguageChange?: (id: LANGUAGE_ID) => void
  onVaultListImport?: (id: string) => void
  onRpcChange?: () => void
}

export const SettingsModal = (props: SettingsModalProps) => {
  const {
    locales,
    disable,
    hide,
    onCurrencyChange,
    onLanguageChange,
    onVaultListImport,
    onRpcChange
  } = props

  const router = useRouter()

  const { view, setView } = useSettingsModalView()

  const { isModalOpen, setIsModalOpen } = useIsModalOpen(MODAL_KEYS.settings)

  const supportedNetworks = useNetworks()

  const customNetworks = useMemo(() => {
    return [...new Set([NETWORK.mainnet, ...supportedNetworks])]
  }, [supportedNetworks])

  const modalViews: Record<SettingsModalView, ReactNode> = {
    menu: <MenuView disable={disable} hide={hide} />,
    currency: <CurrencyView onCurrencyChange={onCurrencyChange} />,
    language: <LanguageView locales={locales} onLanguageChange={onLanguageChange} />,
    vaultLists: <VaultListView onSuccess={onVaultListImport} />,
    customRPCs: (
      <RPCsView
        chainIds={customNetworks}
        onClickPageReload={() => {
          onRpcChange?.()
          router.reload()
        }}
      />
    ),
    misc: <MiscSettingsView />
  }

  if (isModalOpen) {
    return (
      <Modal
        headerContent={
          view !== 'menu' ? (
            <ArrowLeftIcon
              className='h-6 w-6 text-pt-purple-100 cursor-pointer'
              onClick={() => setView('menu')}
            />
          ) : undefined
        }
        bodyContent={modalViews[view]}
        onClose={() => {
          setIsModalOpen(false)
          setView('menu')
        }}
        label='settings'
        mobileStyle='cover'
      />
    )
  }

  return <></>
}
