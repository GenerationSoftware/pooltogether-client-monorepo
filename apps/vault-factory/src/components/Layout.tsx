import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Toaster } from '@shared/ui'
import { LINKS } from '@shared/utilities'
import classNames from 'classnames'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'
import { PoweredByPT } from './PoweredByPT'

interface LayoutProps {
  children: ReactNode
  isSidebarActive?: boolean
  className?: string
}

export const Layout = (props: LayoutProps) => {
  const { children, isSidebarActive, className } = props

  // TODO: when wallet is connected, query vault deployment subgraph and update `useDeployedVaults`

  return (
    <div className='flex flex-col min-h-screen overflow-x-hidden'>
      <Head>
        <title>Cabana Factory</title>
      </Head>

      <SimpleNavbar />

      <Toaster />

      {isSidebarActive && (
        <div className='fixed hidden w-[28rem] h-screen bg-pt-transparent lg:block' />
      )}

      <main
        className={classNames(
          'w-full min-h-[calc(100vh-16rem)] relative flex flex-col items-center mx-auto py-10 md:py-0 lg:px-4',
          className
        )}
      >
        {children}
      </main>

      <SimpleFooter isSidebarActive={isSidebarActive} />
    </div>
  )
}

interface SimpleNavbarProps {
  className?: string
}

const SimpleNavbar = (props: SimpleNavbarProps) => {
  const { className } = props

  return (
    <div
      className={classNames(
        'flex flex-col gap-6 items-center justify-between px-12 py-6 z-30 md:h-36 md:flex-row md:py-0',
        className
      )}
    >
      <Link href='/' className='lg:w-[22rem] lg:mr-12'>
        <Image
          src='/cabanaLogo.svg'
          alt='Cabana Logo'
          width={177}
          height={60}
          priority={true}
          className='w-52 h-auto mx-auto md:mx-0'
        />
      </Link>
      <ConnectButton
        showBalance={false}
        chainStatus={{ smallScreen: 'icon', largeScreen: 'full' }}
        accountStatus='full'
      />
    </div>
  )
}

interface SimpleFooterProps {
  isSidebarActive?: boolean
  className?: string
}

const SimpleFooter = (props: SimpleFooterProps) => {
  const { isSidebarActive, className } = props

  return (
    <footer
      className={classNames(
        'flex flex-col gap-6 items-center mt-auto p-6 overflow-hidden z-20 lg:h-28 lg:flex-row lg:gap-0 lg:p-0',
        className
      )}
    >
      <div
        className={classNames({
          'lg:w-[28rem]': isSidebarActive,
          'lg:absolute lg:right-8': !isSidebarActive
        })}
      >
        <PoweredByPT className='mx-auto' />
      </div>
      <div className='flex flex-col gap-2 items-center mx-auto'>
        <span className='inline-block text-center text-sm font-medium'>
          Made with ❤️ & 🤖 by{' '}
          <a href='https://g9software.xyz' target='_blank' className='hover:text-pt-teal'>
            Generation Software
          </a>
        </span>
        <span className='text-xs font-medium text-pt-pink'>
          By using this app you are agreeing to our{' '}
          <Link href={LINKS.termsOfService} target='_blank' className='hover:underline'>
            Terms and Conditions
          </Link>
        </span>
      </div>
    </footer>
  )
}
