import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { LINKS, Toaster } from '@shared/ui'
import classNames from 'classnames'
import { Footer as FlowbiteFooter } from 'flowbite-react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  className?: string
}

export const Layout = (props: LayoutProps) => {
  const { children, className } = props

  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>PoolTogether Migrations</title>
      </Head>

      <SimpleNavbar />

      <Toaster />

      <main
        className={classNames(
          'w-full max-w-screen-xl relative flex flex-col items-center mx-auto px-4 py-8 mb-40 md:px-8',
          className
        )}
      >
        {children}
      </main>

      <SimpleFooter className='mt-auto' />
    </div>
  )
}

interface SimpleNavbarProps {
  className?: string
}

const SimpleNavbar = (props: SimpleNavbarProps) => {
  const { className } = props

  const router = useRouter()

  return (
    <div
      className={classNames(
        'relative flex flex-col gap-6 items-center justify-between px-12 py-6 z-30',
        'md:h-36 md:flex-row md:py-0',
        className
      )}
    >
      <Link href='/'>
        <Image
          src='/ptLogo.svg'
          alt='PoolTogether'
          width={133}
          height={52}
          className='w-32 h-auto'
          priority={true}
        />
      </Link>
      {router.pathname !== '/' && (
        <Link
          href='/'
          className='absolute inset-0 flex gap-1 items-center justify-center text-pt-purple-100'
        >
          <ArrowUturnLeftIcon className='h-6 w-6' />
          <span className='font-medium'>Back to Home</span>
        </Link>
      )}
      <ConnectButton
        showBalance={false}
        chainStatus={{ smallScreen: 'icon', largeScreen: 'full' }}
        accountStatus='full'
      />
    </div>
  )
}

interface SimpleFooterProps {
  className?: string
}

interface FooterItem {
  title: string
  content: FooterItemContentProps[]
  className?: string
  titleClassName?: string
  itemClassName?: string
}

export const SimpleFooter = (props: SimpleFooterProps) => {
  const { className } = props

  const footerItems: FooterItem[] = [
    {
      title: 'Read The Migration Details',
      content: [],
      className: 'min-w-full md:min-w-[50%]'
    },
    {
      title: 'Get Help',
      content: [
        { content: 'User Docs', href: 'https://docs.pooltogether.com/' },
        { content: 'Dev Docs', href: 'https://dev.pooltogether.com/' },
        { content: 'V3 Docs', href: 'https://v3.docs.pooltogether.com/' }
      ]
    },
    {
      title: 'Community',
      content: [
        {
          content: 'Discord',
          href: LINKS.discord
        },
        {
          content: 'Twitter',
          href: LINKS.twitter
        },
        {
          content: 'Mirror',
          href: LINKS.mirror
        }
      ]
    }
  ]

  return (
    <FlowbiteFooter
      theme={{
        root: {
          base: 'w-full flex justify-center px-12 pt-12 pb-24 bg-pt-purple-800 shadow z-40 md:px-16'
        }
      }}
      className={classNames(className)}
    >
      <div
        className={classNames(
          'w-full max-w-[1440px] flex justify-between gap-16 text-sm flex-wrap md:text-base'
        )}
      >
        {footerItems.map((item) => {
          return (
            <div
              key={`ft-${item.title.toLowerCase().replaceAll(' ', '-')}`}
              className={classNames('w-24 grow', item.className)}
            >
              <FlowbiteFooter.Title
                theme={{ base: 'mb-6' }}
                title={item.title}
                className={classNames('text-pt-purple-400', item.titleClassName)}
              />
              <FlowbiteFooter.LinkGroup theme={{ base: 'flex flex-col gap-6 text-pt-purple-100' }}>
                {item.content.map((content, i) => {
                  return (
                    <FooterItemContent
                      key={`ft-item-${item.title.toLowerCase().replaceAll(' ', '-')}-${i}`}
                      {...content}
                      className={item.itemClassName}
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
      <FlowbiteFooter.Link
        theme={{ base: '' }}
        href={href}
        target='_blank'
        className={classNames(className)}
      >
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
