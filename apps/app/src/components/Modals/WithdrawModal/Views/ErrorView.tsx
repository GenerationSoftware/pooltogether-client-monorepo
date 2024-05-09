import { ErrorPooly } from '@shared/react-components'
import { Button } from '@shared/ui'
import { useTranslations } from 'next-intl'
import { WithdrawModalView } from '..'

interface ErrorViewProps {
  setModalView: (view: WithdrawModalView) => void
}

export const ErrorView = (props: ErrorViewProps) => {
  const { setModalView } = props

  const t = useTranslations('TxModals')

  return (
    <div className='flex flex-col gap-6 items-center'>
      <div className='flex flex-col items-center text-lg font-semibold text-center'>
        <span className='text-[#EA8686]'>{t('uhOh')}</span>
        <span>{t('failedTx')}</span>
      </div>
      <ErrorPooly className='w-40 h-auto' />
      <Button
        fullSized={true}
        color='transparent'
        onClick={() => setModalView('main')}
        className='md:mt-32'
      >
        {t('tryAgain')}
      </Button>
    </div>
  )
}
