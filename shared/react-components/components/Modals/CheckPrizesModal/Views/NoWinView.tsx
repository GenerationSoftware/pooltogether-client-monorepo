import { Button } from '@shared/ui'
import classNames from 'classnames'
import Lottie from 'lottie-react'
import { noWinAnimation } from '../animations'

interface NoWinViewProps {
  onClose: () => void
}

export const NoWinView = (props: NoWinViewProps) => {
  const { onClose } = props

  return (
    <div className='flex flex-col items-center'>
      <span className='text-center text-3xl font-medium text-gray-100'>No prizes this time...</span>
      <Lottie
        animationData={noWinAnimation}
        loop={true}
        className='w-full h-auto pointer-events-none'
      />
      <Button onClick={onClose} className={classNames('mx-auto')}>
        View Your Account
      </Button>
    </div>
  )
}
