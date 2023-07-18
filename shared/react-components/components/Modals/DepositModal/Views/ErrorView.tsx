import { Intl } from '@shared/types'
import { Button } from '@shared/ui'
import { DepositModalView } from '..'
import { ErrorPooly } from '../../../Graphics/ErrorPooly'

interface ErrorViewProps {
  setModalView: (view: DepositModalView) => void
  intl?: Intl<'uhOh' | 'failedTx' | 'tryAgain'>
}

export const ErrorView = (props: ErrorViewProps) => {
  const { setModalView, intl } = props

  return (
    <div className='flex flex-col gap-6 items-center'>
      <div className='flex flex-col items-center text-lg font-semibold text-center'>
        <span className='text-[#EA8686]'>{intl?.('uhOh') ?? 'Uh oh!'}</span>
        <span>{intl?.('failedTx') ?? 'Something went wrong...'}</span>
      </div>
      <ErrorPooly className='w-40 h-auto' />
      <Button
        fullSized={true}
        color='transparent'
        onClick={() => setModalView('main')}
        className='md:mt-32'
      >
        {intl?.('tryAgain') ?? 'Try Again'}
      </Button>
    </div>
  )
}
