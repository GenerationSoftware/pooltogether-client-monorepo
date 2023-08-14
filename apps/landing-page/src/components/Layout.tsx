import { Button, LINKS, SocialIcon, SocialIconProps } from '@shared/ui'
import classNames from 'classnames'
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
        'flex flex-col gap-6 items-center justify-between px-24 py-12 z-30 md:flex-row',
        props.className
      )}
    >
      <Link href='/'>
        <Image
          src='/cabanaLogo.svg'
          alt='Cabana Logo'
          width={152}
          height={34}
          priority={true}
          className='w-52 h-auto'
        />
      </Link>
      <Link href={LINKS.protocolLandingPage} target='_blank'>
        <div className='flex flex-col items-center'>
          <span className='text-pt-purple-300'>Powered by</span>
          <Image
            src='/ptLogo.svg'
            alt='PoolTogether'
            width={183}
            height={72}
            className='w-32 h-auto'
          />
        </div>
      </Link>
      <div className='flex gap-6 items-center'>
        {/* TODO: need cabana-specific docs link */}
        <SimpleNavbarLink href={LINKS.docs} name='Docs' />
        <SimpleNavbarLink href='/tools' name='Tools' />
        <Button href={LINKS.app} color='purple'>
          Launch App
        </Button>
      </div>
    </div>
  )
}

interface SimpleNavbarLinkProps {
  href: string
  name: string
  className?: string
}

const SimpleNavbarLink = (props: SimpleNavbarLinkProps) => {
  const { href, name, className } = props

  const router = useRouter()

  const isActive = href === router.pathname

  return (
    <Link
      href={href}
      target={href.startsWith('http') ? '_blank' : '_self'}
      className={classNames(
        'text-pt-purple-200 border-b-2',
        { 'border-b-pt-teal-dark': isActive, 'border-b-transparent': !isActive },
        className
      )}
    >
      {name}
    </Link>
  )
}

const SimpleFooter = (props: { className?: string }) => {
  return (
    <footer className={classNames('flex flex-col mt-auto pb-28 z-20', props.className)}>
      <SimpleFooterWave />
      <div className='w-full flex items-center justify-between px-16 bg-pt-purple-700'>
        <div className='flex gap-12'>
          <div className='flex flex-col gap-3'>
            <span className='text-pt-purple-300'>Cabana made by</span>
            <a href='https://g9software.xyz' target='_blank'>
              <Image src='/generationLogo.svg' alt='Generation Software' width={261} height={38} />
            </a>
          </div>
          <div className='flex flex-col gap-3'>
            <span className='text-pt-purple-300'>PoolTogether audits by</span>
            <div className='flex gap-6 items-center opacity-50'>
              {/* TODO: add link to c4 audit(s) */}
              <Link href={LINKS.audits} target='_blank'>
                <Image src='/c4Logo.svg' alt='Code Arena' width={257} height={46} />
              </Link>
              {/* TODO: add link to macro audit(s) */}
              <Link href={LINKS.audits} target='_blank'>
                <Image src='/macroLogo.svg' alt='Macro' width={191} height={40} />
              </Link>
            </div>
          </div>
        </div>
        <div className='flex gap-6 items-end'>
          <div className='flex gap-4 items-center'>
            <SimpleSocialIcon platform='twitter' href={LINKS.twitter} />
            <SimpleSocialIcon platform='discord' href={LINKS.discord} />
          </div>
          <Link href={LINKS.protocolLandingPage} target='_blank'>
            <div className='flex flex-col gap-1'>
              <span className='text-pt-purple-300'>Powered by</span>
              <Image
                src='/ptLogo.svg'
                alt='PoolTogether'
                width={183}
                height={72}
                className='w-32 h-auto'
              />
            </div>
          </Link>
        </div>
      </div>
    </footer>
  )
}

const SimpleFooterWave = () => {
  const router = useRouter()

  return (
    <div
      className={classNames('w-full flex flex-col bg-pt-purple-600 isolate pointer-events-none', {
        'bg-pt-purple-700': router.pathname === '/tools'
      })}
    >
      <Image
        src='/footerWave.svg'
        alt='Footer Wave'
        width={1440}
        height={260}
        priority={true}
        className='w-full drop-shadow-[0_-20px_20px_#8050E3]'
      />
      <span className='w-full h-24 -mt-[1px] bg-pt-purple-700 z-10' />
    </div>
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
        'hover:bg-pt-purple-500',
        className
      )}
    >
      <SocialIcon platform={platform} className='w-6 h-auto text-pt-purple-100' />
    </a>
  )
}
