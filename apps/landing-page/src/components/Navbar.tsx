import { Bars3Icon } from '@heroicons/react/24/outline'
import { Button, LINKS, Logo } from '@shared/ui'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface NavbarProps {
  className?: string
}

export const Navbar = (props: NavbarProps) => {
  const { className } = props

  return (
    <div
      className={classNames(
        'flex items-center justify-between px-6 py-3 z-30',
        'md:px-24 md:py-12',
        className
      )}
    >
      <Link href='/'>
        <Logo smLogoClassName='w-11' mdLogoClassName='w-52' />
      </Link>
      <Link href={LINKS.protocolLandingPage} target='_blank'>
        <div className='flex flex-col items-center'>
          <span className='text-xs text-pt-purple-300 whitespace-nowrap md:text-base'>
            Powered by
          </span>
          <Image
            src='/ptLogo.svg'
            alt='PoolTogether'
            width={183}
            height={72}
            className='w-24 h-auto md:w-32'
          />
        </div>
      </Link>
      <div className='hidden gap-6 items-center md:flex'>
        {/* TODO: need cabana-specific docs link */}
        <NavbarLink href={LINKS.docs} name='Docs' />
        <NavbarLink href='/tools' name='Tools' />
        <Button href={LINKS.app} color='purple'>
          Launch App
        </Button>
      </div>
      {/* TODO: add onclick effect (show options) */}
      <Bars3Icon
        className='h-6 w-6 text-pt-purple-50 hover:text-pt-purple-200 stroke-2 cursor-pointer md:hidden'
        onClick={() => {}}
      />
    </div>
  )
}

interface NavbarLinkProps {
  href: string
  name: string
  className?: string
}

const NavbarLink = (props: NavbarLinkProps) => {
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
