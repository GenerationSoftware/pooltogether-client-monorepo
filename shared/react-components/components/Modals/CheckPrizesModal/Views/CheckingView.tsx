import { Intl } from '@shared/types'

interface CheckingViewProps {
  intl?: Intl<'checking'>
}

export const CheckingView = (props: CheckingViewProps) => {
  const { intl } = props

  return (
    <div className='flex flex-col gap-12 items-center mb-6'>
      <span className='text-xl font-medium text-pt-purple-100'>
        {intl?.('checking') ?? `Checking the blockchain...`}
      </span>
      <img
        src='/checkingPrizesSpinner.gif'
        alt='Checking Prizes Animation'
        className='w-72 h-auto'
      />
    </div>
  )
}
