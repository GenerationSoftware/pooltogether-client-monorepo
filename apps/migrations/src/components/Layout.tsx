import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Toaster } from '@shared/ui'
import classNames from 'classnames'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
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
        <title>Cabana Migrations</title>
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
      <ConnectButton
        showBalance={false}
        chainStatus={{ smallScreen: 'icon', largeScreen: 'full' }}
        accountStatus='full'
      />
    </div>
  )
}