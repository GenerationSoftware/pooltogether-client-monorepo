import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { CURRENCY_ID, LANGUAGE_ID, MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { Intl, VaultList } from '@shared/types'
import { Modal } from '@shared/ui'
import { NETWORK } from '@shared/utilities'
import { ReactNode } from 'react'
import { CurrencyView } from './Views/CurrencyView'
import { LanguageView } from './Views/LanguageView'
import { MenuView } from './Views/MenuView'
import { RPCsView } from './Views/RPCsView'
import { VaultListView } from './Views/VaultListView'

export type SettingsModalOption = 'currency' | 'language' | 'vaultLists' | 'customRPCs'

export type SettingsModalView = 'menu' | SettingsModalOption

export interface SettingsModalProps {
  view: SettingsModalView
  setView: (view: SettingsModalView) => void
  locales?: LANGUAGE_ID[]
  localVaultLists: { [id: string]: VaultList }
  supportedNetworks?: NETWORK[]
  disable?: SettingsModalOption[]
  hide?: SettingsModalOption[]
  onCurrencyChange?: (id: CURRENCY_ID) => void
  onLanguageChange?: (id: LANGUAGE_ID) => void
  onVaultListImport?: (id: string) => void
  intl?: {
    base?: Intl<
      | 'customizeExperience'
      | 'customizeCurrency'
      | 'customizeLanguage'
      | 'changeCurrency'
      | 'changeLanguage'
      | 'viewEcosystem'
      | 'manageVaultLists'
      | 'getHelp'
      | 'getHelpWithCabana'
      | 'vaultListsDescription'
      | 'learnMoreVaultLists'
      | 'urlInput'
      | 'addVaultList'
      | 'clearImportedVaultLists'
      | 'numTokens'
      | 'imported'
    >
    errors?: Intl<'formErrors.invalidSrc' | 'formErrors.invalidVaultList'>
  }
}

export const SettingsModal = (props: SettingsModalProps) => {
  const {
    view,
    setView,
    locales,
    localVaultLists,
    supportedNetworks,
    disable,
    hide,
    onCurrencyChange,
    onLanguageChange,
    onVaultListImport,
    intl
  } = props

  const { isModalOpen, setIsModalOpen } = useIsModalOpen(MODAL_KEYS.settings)

  const modalViews: Record<SettingsModalView, ReactNode> = {
    menu: <MenuView setView={setView} disable={disable} hide={hide} intl={intl?.base} />,
    currency: (
      <CurrencyView setView={setView} onCurrencyChange={onCurrencyChange} intl={intl?.base} />
    ),
    language: (
      <LanguageView
        setView={setView}
        locales={locales}
        onLanguageChange={onLanguageChange}
        intl={intl?.base}
      />
    ),
    vaultLists: (
      <VaultListView localVaultLists={localVaultLists} onSuccess={onVaultListImport} intl={intl} />
    ),
    customRPCs: <RPCsView chainIds={supportedNetworks ?? []} />
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
