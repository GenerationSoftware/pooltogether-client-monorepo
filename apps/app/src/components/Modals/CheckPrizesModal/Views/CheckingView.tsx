import { useTranslations } from 'next-intl'

export const CheckingView = () => {
  const t = useTranslations('Account.prizeChecking')

  return (
    <div className='flex flex-col gap-12 items-center mb-6'>
      <span className='text-xl font-medium text-pt-purple-100'>{t('checking')}</span>
      <img
        src='/checkingPrizesSpinner.gif'
        alt='Checking Prizes Animation'
        className='w-72 h-auto'
      />
    </div>
  )
}
