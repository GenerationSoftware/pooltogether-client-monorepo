import classNames from 'classnames'

export interface SpinnerProps {
  size?: 'sm' | 'lg'
  className?: string
}

export const Spinner = (props: SpinnerProps) => {
  const { size, className } = props

  return (
    <div
      className={classNames(
        'inline-block after:block after:w-full after:h-full after:rounded-full',
        'after:border-solid after:border-y-pt-purple-50 after:border-x-transparent',
        'after:animate-spin',
        {
          'w-5 h-5 after:border-2': size === 'sm' || !size,
          'w-32 h-32 after:border-8': size === 'lg'
        },
        className
      )}
    />
  )
}
