import { LINKS, SocialIcon, SocialIconProps } from '@shared/ui'
import classNames from 'classnames'
import Head from 'next/head'
import Image from 'next/image'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  className?: string
}

export const Layout = (props: LayoutProps) => {
  const { children, className } = props

  return (
    <div className='flex flex-col min-h-screen overflow-x-hidden'>
      <Head>
        <title>Cabana</title>
      </Head>

      <SimpleNavbar />

      <main
        className={classNames(
          'w-full relative flex flex-col flex-grow items-center mx-auto',
          className
        )}
      >
        {children}
      </main>

      <SimpleFooter />
    </div>
  )
}

const SimpleNavbar = (props: { className?: string }) => {
  return (
    <div
      className={classNames(
        'flex flex-col gap-6 items-center justify-between z-30 md:flex-row',
        props.className
      )}
    >
      <Image
        src='/cabanaLogo.svg'
        alt='Cabana Logo'
        width={300}
        height={80}
        priority={true}
        className='w-[300px] h-auto'
      />
      <Image
        src='/poweredByPT.svg'
        alt='Powered By PoolTogether'
        width={134}
        height={73}
        priority={true}
        className='w-32 h-auto'
      />
    </div>
  )
}

const SimpleFooter = (props: { className?: string }) => {
  return (
    <footer
      className={classNames('flex items-center justify-between mt-auto p-16 z-20', props.className)}
    >
      <span className='max-w-[1/3] text-xl text-pt-purple-100'>
        Cabana is a suite of open source interfaces for PoolTogether, made by{' '}
        <a
          href='https://g9software.xyz'
          target='_blank'
          className='text-pt-purple-300 hover:text-pt-purple-200'
        >
          Generation Software
        </a>
      </span>
      <div className='flex gap-4 items-center '>
        <SimpleSocialIcon platform='twitter' href={LINKS.twitter} />
        <SimpleSocialIcon platform='discord' href={LINKS.discord} />
      </div>
    </footer>
  )
}

interface SimpleSocialIconProps extends SocialIconProps {
  href: string
}

const SimpleSocialIcon = (props: SimpleSocialIconProps) => {
  const { platform, href, className } = props

  return (
    <a
      href={href}
      target='_blank'
      className={classNames(
        'w-12 h-12 flex items-center justify-center rounded-full bg-pt-purple-600',
        className
      )}
    >
      <SocialIcon platform={platform} className='w-6 h-auto text-pt-purple-100' />
    </a>
  )
}
