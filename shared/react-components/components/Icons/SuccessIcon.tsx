import { CheckIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'

export interface SuccessIconProps {
  className?: string
}

export const SuccessIcon = (props: SuccessIconProps) => {
  const { className } = props

  return (
    <div
      className={classNames(
        'flex items-center justify-center h-12 w-12 bg-[#D5FDF6] rounded-full',
        className
      )}
    >
      <CheckIcon className='h-8 w-8 text-pt-teal-dark' />
    </div>
  )
}
