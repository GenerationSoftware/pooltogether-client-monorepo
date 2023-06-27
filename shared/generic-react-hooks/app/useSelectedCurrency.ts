import { atom, useAtom } from 'jotai'
import { CURRENCY_ID, SUPPORTED_CURRENCIES } from '../constants/currencies'
import { LOCAL_STORAGE_KEYS } from '../constants/keys'

const getInitialSelectedCurrency = (): CURRENCY_ID => {
  // TODO: set initial currency to match user's locale if never set
  if (typeof window === 'undefined') return 'usd'
  const cachedCurrency = localStorage.getItem(LOCAL_STORAGE_KEYS.selectedCurrency)
  if (!!cachedCurrency && cachedCurrency in SUPPORTED_CURRENCIES) {
    return cachedCurrency as CURRENCY_ID
  } else {
    return 'usd'
  }
}

const selectedCurrencyAtom = atom<CURRENCY_ID>(getInitialSelectedCurrency())

/**
 * Returns the state of `selectedCurrencyAtom` as well as a method to change it
 *
 * Stores state in local storage
 * @returns
 */
export const useSelectedCurrency = () => {
  const [selectedCurrency, _setSelectedCurrency] = useAtom(selectedCurrencyAtom)

  const setSelectedCurrency = (currency: CURRENCY_ID) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.selectedCurrency, currency)
    _setSelectedCurrency(currency)
  }

  return { selectedCurrency, setSelectedCurrency }
}
