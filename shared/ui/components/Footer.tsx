import classNames from 'classnames'
import { Footer as FlowbiteFooter, FooterProps as FlowbiteFooterProps } from 'flowbite-react'
import { ReactNode } from 'react'

export interface FooterItem {
  title: string
  content: FooterItemContentProps[]
  className?: string
  titleClassName?: string
  itemClassName?: string
}

export interface FooterProps extends FlowbiteFooterProps {
  items: FooterItem[]
  containerClassName?: string
  titleClassName?: string
  itemClassName?: string
}

export const Footer = (props: FooterProps) => {
  const { items, containerClassName, titleClassName, itemClassName, className, ...rest } = props

  return (
    <FlowbiteFooter
      theme={{
        root: {
          base: 'w-full flex justify-center px-12 pt-12 pb-24 shadow z-40 md:px-16'
        }
      }}
      className={classNames(className)}
      {...rest}
    >
      <div
        className={classNames(
          'w-full flex justify-between gap-16 text-sm flex-wrap md:text-base',
          containerClassName
        )}
      >
        {items.map((item) => {
          return (
            <div
              key={`ft-${item.title.toLowerCase().replaceAll(' ', '-')}`}
              className={classNames('w-24 grow', item.className)}
            >
              <FlowbiteFooter.Title
                theme={{ base: 'mb-6' }}
                title={item.title}
                className={classNames(titleClassName, item.titleClassName)}
              />
              <FlowbiteFooter.LinkGroup theme={{ base: 'flex flex-col gap-6 text-pt-purple-100' }}>
                {item.content.map((content, i) => {
                  return (
                    <FooterItemContent
                      key={`ft-item-${item.title.toLowerCase().replaceAll(' ', '-')}-${i}`}
                      {...content}
                      className={classNames(itemClassName, item.itemClassName)}
                    />
                  )
                })}
              </FlowbiteFooter.LinkGroup>
            </div>
          )
        })}
      </div>
    </FlowbiteFooter>
  )
}

interface FooterItemContentProps {
  content: ReactNode
  href?: string
  icon?: JSX.Element
  onClick?: () => void
  disabled?: boolean
}

const FooterItemContent = (props: FooterItemContentProps & { className?: string }) => {
  const { content, href, icon, onClick, disabled, className } = props

  const baseClassName = 'flex items-center gap-2 whitespace-nowrap'

  if (disabled) {
    return (
      <span className={classNames(baseClassName, 'text-pt-purple-300', className)}>
        {icon}
        {content}
      </span>
    )
  }

  if (!!href) {
    return (
      <FlowbiteFooter.Link theme={{ base: '' }} href={href} className={classNames(className)}>
        <span className={classNames(baseClassName)}>
          {icon}
          {content}
        </span>
      </FlowbiteFooter.Link>
    )
  }

  return (
    <span
      className={classNames(baseClassName, { 'cursor-pointer': onClick !== undefined }, className)}
      onClick={onClick}
    >
      {icon}
      {content}
    </span>
  )
}
