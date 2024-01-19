import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'
import { LOCAL_STORAGE_KEYS } from '../constants/keys'
import { LANGUAGE_ID, SUPPORTED_LANGUAGES } from '../constants/languages'

const getInitialSelectedLanguage = (): LANGUAGE_ID => {
  // TODO: set initial language to match user's locale if never set
  if (typeof window === 'undefined') return 'en'
  const cachedLanguage = localStorage.getItem(LOCAL_STORAGE_KEYS.selectedLanguage)
  if (!!cachedLanguage && cachedLanguage in SUPPORTED_LANGUAGES) {
    return cachedLanguage as LANGUAGE_ID
  } else {
    return 'en'
  }
}

export const useLocalStorageLanguage = (
  callback: (lang: LANGUAGE_ID | undefined) => void
): void => {
  let lang
  if (typeof window === 'undefined') {
    console.log('4')
    lang = 'en' as LANGUAGE_ID
  }

  if (typeof Storage !== 'undefined') {
    const cachedLanguage = localStorage.getItem(LOCAL_STORAGE_KEYS.selectedLanguage)
    if (!!cachedLanguage && cachedLanguage in SUPPORTED_LANGUAGES) {
      console.log('1')
      lang = cachedLanguage as LANGUAGE_ID
    } else {
      console.log('2')
      lang = 'en' as LANGUAGE_ID
    }
  } else {
    console.log('3')
    lang = 'en' as LANGUAGE_ID
  }

  callback(lang)
}

const selectedLanguageAtom = atom<LANGUAGE_ID>(getInitialSelectedLanguage())

/**
 * Returns the state of `selectedLanguageAtom` as well as a method to change it
 *
 * Stores state in local storage
 * @returns
 */
export const useSelectedLanguage = (options?: {
  onLanguageChange?: (language: LANGUAGE_ID) => void
}) => {
  const [selectedLanguage, _setSelectedLanguage] = useAtom(selectedLanguageAtom)

  const setSelectedLanguage = (language: LANGUAGE_ID) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.selectedLanguage, language)
    _setSelectedLanguage(language)
  }

  useEffect(() => {
    options?.onLanguageChange?.(selectedLanguage)
  }, [selectedLanguage])

  return { selectedLanguage, setSelectedLanguage }
}
