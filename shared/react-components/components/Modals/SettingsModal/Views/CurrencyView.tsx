import { CheckIcon } from '@heroicons/react/24/outline'
import { CURRENCY_ID, SUPPORTED_CURRENCIES, useSelectedCurrency } from '@shared/generic-react-hooks'
import classNames from 'classnames'
import { SettingsModalView } from '..'

interface CurrencyViewProps {
  setView: (view: SettingsModalView) => void
}

export const CurrencyView = (props: CurrencyViewProps) => {
  const { setView } = props

  const currencies = Object.keys(SUPPORTED_CURRENCIES) as CURRENCY_ID[]

  return (
    <div className='flex flex-col items-center gap-4 px-4'>
      <span className='textl-lg font-semibold text-pt-purple-50 order-first md:text-xl'>
        Customize Currency
      </span>
      {currencies.map((id) => {
        return <CurrencyItem key={`curr-item-${id}`} id={id} setView={setView} />
      })}
    </div>
  )
}

interface CurrencyItemProps {
  id: CURRENCY_ID
  setView: (view: SettingsModalView) => void
}

const CurrencyItem = (props: CurrencyItemProps) => {
  const { id, setView } = props

  const { selectedCurrency, setSelectedCurrency } = useSelectedCurrency()

  return (
    <div
      className={classNames(
        'w-full rounded-[6px] p-4 bg-pt-transparent hover:bg-pt-transparent/5 cursor-pointer select-none',
        { 'outline outline-2 outline-pt-teal-dark -order-1': id === selectedCurrency }
      )}
      onClick={() => {
        setSelectedCurrency(id)
        setView('menu')
      }}
    >
      <span className='flex items-center justify-center gap-2 text-pt-purple-50'>
        {id === selectedCurrency && <CheckIcon className='h-4 w-4 text-inherit' />}
        {`${SUPPORTED_CURRENCIES[id].name} (${SUPPORTED_CURRENCIES[id].symbol})`}
      </span>
    </div>
  )
}
