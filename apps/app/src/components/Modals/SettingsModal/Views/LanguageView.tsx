import { CheckIcon } from '@heroicons/react/24/outline'
import { LANGUAGE_ID, SUPPORTED_LANGUAGES, useSelectedLanguage } from '@shared/generic-react-hooks'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useSettingsModalView } from '@hooks/useSettingsModalView'

interface LanguageViewProps {
  locales?: LANGUAGE_ID[]
  onLanguageChange?: (id: LANGUAGE_ID) => void
}

export const LanguageView = (props: LanguageViewProps) => {
  const { locales, onLanguageChange } = props

  const t = useTranslations('Settings')

  const allLanguages = Object.keys(SUPPORTED_LANGUAGES) as LANGUAGE_ID[]
  const languages =
    !!locales && locales.length > 0
      ? allLanguages.filter((id) => locales.includes(id))
      : allLanguages

  return (
    <div className='flex flex-col items-center gap-4 px-4'>
      <span className='text-lg font-semibold text-pt-purple-50 order-first md:text-xl'>
        {t('customizeLanguage')}
      </span>
      {languages.map((id) => {
        return <LanguageItem key={`lang-item-${id}`} id={id} onSelect={onLanguageChange} />
      })}
    </div>
  )
}

interface LanguageItemProps {
  id: LANGUAGE_ID
  onSelect?: (id: LANGUAGE_ID) => void
}

const LanguageItem = (props: LanguageItemProps) => {
  const { id, onSelect } = props

  const { setView: setSettingsModalView } = useSettingsModalView()

  const { selectedLanguage, setSelectedLanguage } = useSelectedLanguage()

  return (
    <div
      className={classNames(
        'w-full rounded-[6px] p-4 bg-pt-transparent hover:bg-pt-transparent/5 cursor-pointer select-none',
        { 'outline outline-2 outline-pt-teal-dark -order-1': id === selectedLanguage }
      )}
      onClick={() => {
        setSelectedLanguage(id)
        onSelect?.(id)
        setSettingsModalView('menu')
      }}
    >
      <span className='flex items-center justify-center gap-2 text-pt-purple-50'>
        {id === selectedLanguage && <CheckIcon className='h-4 w-4 text-inherit' />}
        {`${id.toUpperCase()} - ${SUPPORTED_LANGUAGES[id].nativeName} (${
          SUPPORTED_LANGUAGES[id].name
        })`}
      </span>
    </div>
  )
}
