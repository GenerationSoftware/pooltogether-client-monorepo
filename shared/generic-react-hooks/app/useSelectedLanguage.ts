import { atom, useAtom } from 'jotai'
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

const selectedLanguageAtom = atom<LANGUAGE_ID>(getInitialSelectedLanguage())

/**
 * Returns the state of `selectedLanguageAtom` as well as a method to change it
 *
 * Stores state in local storage
 * @returns
 */
export const useSelectedLanguage = () => {
  const [selectedLanguage, _setSelectedLanguage] = useAtom(selectedLanguageAtom)

  const setSelectedLanguage = (language: LANGUAGE_ID) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.selectedLanguage, language)
    _setSelectedLanguage(language)
  }

  return { selectedLanguage, setSelectedLanguage }
}
