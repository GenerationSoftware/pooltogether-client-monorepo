import { CubeTransparentIcon, SparklesIcon } from '@heroicons/react/24/outline'
import {
  SUPPORTED_CURRENCIES,
  useSelectedCurrency,
  useSelectedLanguage
} from '@shared/generic-react-hooks'
import { ClipboardListIcon } from '@shared/react-components'
import { BasicIcon } from '@shared/ui'
import { LINKS } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { ReactNode } from 'react'
import { useSettingsModalView } from '@hooks/useSettingsModalView'
import { SettingsModalOption } from '..'

interface MenuViewProps {
  disable?: SettingsModalOption[]
  hide?: SettingsModalOption[]
}

export const MenuView = (props: MenuViewProps) => {
  const { disable, hide } = props

  const t = useTranslations('Settings')

  const { setView: setSettingsModalView } = useSettingsModalView()

  const { selectedCurrency } = useSelectedCurrency()
  const { selectedLanguage } = useSelectedLanguage()

  return (
    <div className='flex flex-col gap-4'>
      <SettingsMenuSection
        title={t('customizeExperience')}
        items={[
          {
            iconContent: SUPPORTED_CURRENCIES[selectedCurrency].symbol,
            title: t('changeCurrency'),
            onClick: () => setSettingsModalView('currency'),
            disabled: disable?.includes('currency'),
            hidden: hide?.includes('currency')
          },
          {
            iconContent: selectedLanguage.toUpperCase(),
            iconClassName: '!text-base font-semibold',
            title: t('changeLanguage'),
            onClick: () => setSettingsModalView('language'),
            disabled: disable?.includes('language'),
            hidden: hide?.includes('language')
          },
          {
            iconContent: <SparklesIcon className='h-6 w-6 text-pt-purple-100' />,
            title: t('viewEcosystem'),
            onClick: () => window.open(LINKS.ecosystem)
          },
          {
            iconContent: <ClipboardListIcon className='h-6 w-6 text-pt-purple-100' />,
            title: t('manageVaultLists'),
            onClick: () => setSettingsModalView('vaultLists'),
            disabled: disable?.includes('vaultLists'),
            hidden: hide?.includes('vaultLists')
          },
          {
            iconContent: <CubeTransparentIcon className='h-6 w-6 text-pt-purple-100' />,
            title: t('setCustomRPCs'),
            onClick: () => setSettingsModalView('customRPCs'),
            disabled: disable?.includes('customRPCs'),
            hidden: hide?.includes('customRPCs')
          }
        ]}
      />
      <SettingsMenuSection
        title={t('getHelp')}
        items={[
          {
            iconContent: '?',
            iconClassName: 'font-semibold',
            title: t('getHelpWithCabana'),
            onClick: () => window.open(LINKS.docs)
          }
        ]}
      />
    </div>
  )
}

interface SettingsMenuSectionProps {
  title: string
  items: SettingsMenuItemProps[]
}

const SettingsMenuSection = (props: SettingsMenuSectionProps) => {
  const { title, items } = props

  return (
    <div className='flex flex-col gap-4'>
      <span className='text-xl font-semibold text-pt-purple-50 md:text-2xl'>{title}</span>
      {items.map((item) => {
        return (
          <SettingsMenuItem
            key={`st-item-${item.title.toLowerCase().replaceAll(' ', '-')}`}
            {...item}
          />
        )
      })}
    </div>
  )
}

interface SettingsMenuItemProps {
  iconContent: ReactNode
  title: string
  onClick: () => void
  iconClassName?: string
  disabled?: boolean
  hidden?: boolean
}

const SettingsMenuItem = (props: SettingsMenuItemProps) => {
  const { iconContent, title, onClick, iconClassName, disabled, hidden } = props

  return (
    <div
      className={classNames(
        'flex gap-3 w-full items-center rounded-lg px-8 py-4 select-none relative bg-pt-transparent hover:bg-pt-transparent/5',
        { 'cursor-pointer': !disabled, 'brightness-50': disabled },
        { hidden: hidden }
      )}
      onClick={() => {
        if (!disabled) {
          onClick()
        }
      }}
    >
      <BasicIcon content={iconContent} size='lg' theme='dark' className={iconClassName} />
      <span className='flex items-center text-pt-purple-50'>{title}</span>
    </div>
  )
}
