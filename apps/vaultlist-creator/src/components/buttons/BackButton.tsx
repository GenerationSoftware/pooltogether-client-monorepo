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
      color='teal'
      outline={true}
      className={classNames('self-start', className)}
    >
      <div className='flex gap-2 items-center'>
        <ArrowLeftIcon className='w-4 h-4 lg:w-5 lg:h-5' />
        <span className='text-xs lg:text-sm'>{text}</span>
      </div>
    </Button>
  )
}
