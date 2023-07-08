import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Button } from '@shared/ui'
import classNames from 'classnames'
import { useSetAtom } from 'jotai'
import { appViewAtom } from 'src/atoms'
import { AppView } from 'src/types'

interface BackButtonProps {
  toView: AppView
  text?: string
  className?: string
}

export const BackButton = (props: BackButtonProps) => {
  const { toView, text, className } = props

  const setView = useSetAtom(appViewAtom)

  return (
    <Button
      onClick={() => setView(toView)}
      color='white'
      outline={true}
      className={classNames('self-start', className)}
    >
      <div className='flex gap-2 items-center'>
        <ArrowLeftIcon className='w-5 h-5' />
        {text}
      </div>
    </Button>
  )
}
