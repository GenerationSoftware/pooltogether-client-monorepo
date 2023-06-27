import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { VaultList } from '@pooltogether/hyperstructure-client-js'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { Modal } from '@shared/ui'
import { ReactNode } from 'react'
import { CurrencyView } from './Views/CurrencyView'
import { LanguageView } from './Views/LanguageView'
import { MenuView } from './Views/MenuView'
import { VaultListView } from './Views/VaultListView'

export type SettingsModalOption = 'currency' | 'language' | 'vaultLists'

export type SettingsModalView = 'menu' | SettingsModalOption

export interface SettingsModalProps {
  view: SettingsModalView
  setView: (view: SettingsModalView) => void
  localVaultLists?: { [id: string]: VaultList }
  disable?: SettingsModalOption[]
  hide?: SettingsModalOption[]
}

export const SettingsModal = (props: SettingsModalProps) => {
  const { view, setView, localVaultLists, disable, hide } = props

  const { isModalOpen, setIsModalOpen } = useIsModalOpen(MODAL_KEYS.settings)

  const modalViews: Record<SettingsModalView, ReactNode> = {
    menu: <MenuView setView={setView} disable={disable} hide={hide} />,
    currency: <CurrencyView setView={setView} />,
    language: <LanguageView setView={setView} />,
    vaultLists: <VaultListView localVaultLists={localVaultLists} />
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
