import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { PurpleButton, PurpleButtonProps } from './PurpleButton'

interface BackButtonProps extends Omit<PurpleButtonProps, 'outline' | 'children'> {}

export const BackButton = (props: BackButtonProps) => {
  const { onClick, className, innerClassName, ...rest } = props

  const router = useRouter()

  const defaultOnClick = () => {
    router.push('/')
  }

  return (
    <PurpleButton
      onClick={onClick ?? defaultOnClick}
      outline={true}
      className={classNames('w-28', className)}
      innerClassName={classNames('flex gap-2 items-center', innerClassName)}
      {...rest}
    >
      <ArrowLeftIcon className='w-4 h-4' /> Back
    </PurpleButton>
  )
}
