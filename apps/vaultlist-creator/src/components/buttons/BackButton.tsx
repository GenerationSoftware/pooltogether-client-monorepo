import { ArrowLeftIcon } from '@heroicons/react/24/outline'
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
    <div
      onClick={() => setView(toView)}
      className={classNames('flex gap-2 items-center text-pt-purple-100 cursor-pointer', className)}
    >
      <ArrowLeftIcon className='w-5 h-5' />
      <span className='text-sm'>{text}</span>
    </div>
  )
}
