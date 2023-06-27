import classNames from 'classnames'
import { ReactNode } from 'react'

export interface BasicIconProps {
  content: ReactNode
  theme?: 'light' | 'dark'
  size?: 'sm' | 'lg'
  className?: string
}

export const BasicIcon = (props: BasicIconProps) => {
  const { content, theme, size, className } = props

  return (
    <div
      className={classNames(
        'rounded-full flex shrink-0 items-center justify-center',
        {
          'bg-pt-purple-100 text-pt-purple-800': theme === 'light' || !theme,
          'bg-pt-purple-400 text-pt-purple-100': theme === 'dark',
          'text-xs h-6 w-6': size === 'sm' || !size,
          'text-lg h-8 w-8': size === 'lg'
        },
        className
      )}
    >
      {content}
    </div>
  )
}
