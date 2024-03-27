import { ExternalLink } from '@shared/ui'
import classNames from 'classnames'
import { ReactNode } from 'react'

interface ResourceLinkProps {
  href: string
  children: ReactNode
  className?: string
}

export const ResourceLink = (props: ResourceLinkProps) => {
  const { href, children, className } = props

  if (!href) {
    return (
      <ExternalLink
        href={href}
        size='lg'
        className={classNames('text-xl opacity-50 cursor-not-allowed', className)}
      >
        {children}
      </ExternalLink>
    )
  }

  return (
    <ExternalLink href={href} size='lg' className={classNames('text-xl underline', className)}>
      {children}
    </ExternalLink>
  )
}
