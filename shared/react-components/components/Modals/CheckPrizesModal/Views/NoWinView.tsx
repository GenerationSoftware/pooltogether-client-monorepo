import { RichIntl } from '@shared/types'
import { Button } from '@shared/ui'
import classNames from 'classnames'
import Lottie from 'lottie-react'
import { noWinAnimation } from '../animations'

interface NoWinViewProps {
  onGoToAccount: () => void
  intl?: RichIntl<'noPrizes' | 'viewAccount'>
}

export const NoWinView = (props: NoWinViewProps) => {
  const { onGoToAccount, intl } = props

  return (
    <div className='flex flex-col items-center'>
      <span className='text-center text-3xl font-grotesk font-medium text-gray-100'>
        {intl?.rich('noPrizes', {
          highlight: (chunks) => <span className='text-pt-purple-200'>{chunks}</span>
        }) ?? (
          <>
            Sorry, no prizes <span className='text-pt-purple-200'>...yet!!!</span>
          </>
        )}
      </span>
      <Lottie
        animationData={noWinAnimation}
        loop={true}
        className='w-full max-w-xs h-auto pointer-events-none'
      />
      <Button onClick={onGoToAccount} className={classNames('mx-auto')}>
        {intl?.('viewAccount') ?? `View Your Account`}
      </Button>
    </div>
  )
}
