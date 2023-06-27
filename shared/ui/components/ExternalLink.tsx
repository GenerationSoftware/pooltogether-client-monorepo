import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'

export interface ExternalLinkProps {
  href: string
  text: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
  iconClassName?: string
}

export const ExternalLink = (props: ExternalLinkProps) => {
  const { href, text, size, className, iconClassName } = props

  return (
    <a
      href={href}
      target='_blank'
      rel='noreferrer'
      className={classNames(
        'inline-flex items-center gap-1',
        { 'text-xs': size === 'xs' },
        { 'text-sm': size === 'sm' },
        { 'text-base': size === 'md' || !size },
        { 'text-lg': size === 'lg' },
        className
      )}
    >
      {text}
      <ArrowTopRightOnSquareIcon
        className={classNames(
          'text-inherit',
          {
            'h-4 w-4': size === 'xs' || size === 'sm',
            'h-5 w-5': size === 'md' || !size,
            'h-6 w-6': size === 'lg'
          },
          iconClassName
        )}
      />
    </a>
  )
}
