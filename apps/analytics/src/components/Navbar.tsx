import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

interface NavbarProps {
  className?: string
}

export const Navbar = (props: NavbarProps) => {
  const { className } = props

  return (
    <>
      <div
        className={classNames(
          'flex items-center justify-center px-6 py-3 z-30',
          'md:justify-between md:px-12 md:py-6',
          className
        )}
      >
        <Link href='/' className='flex gap-1 items-center'>
          <Image src='/cabanaLogo.svg' alt='Cabana' width={32} height={32} priority={true} />
          <span className='-mt-[.2rem] font-grotesk font-bold text-[2rem] text-pt-purple-900'>
            Cabanalytics
          </span>
          <span className='ml-2 px-1 font-grotesk font-semibold leading-5 text-red-600 border border-current rounded-[0.2rem]'>
            BETA
          </span>
        </Link>
        <div className='hidden gap-12 items-center md:flex'>
          <NavbarActions />
          <Image
            src='/pooly.svg'
            alt='Pooly'
            width={93}
            height={91}
            className='w-20 h-auto -ml-10'
            priority={true}
          />
        </div>
      </div>
      <MobileNavbar className='z-50 md:hidden'>
        <NavbarActions />
      </MobileNavbar>
    </>
  )
}

interface MobileNavbarProps {
  children?: ReactNode
  className?: string
}

const MobileNavbar = (props: MobileNavbarProps) => {
  const { children, className } = props

  return (
    <div
      className={classNames(
        'fixed bottom-0 flex w-full h-[60px] justify-center items-center gap-6 font-medium',
        'bg-pt-purple-200 border-t-2 border-pt-purple-500',
        className
      )}
    >
      {children}
    </div>
  )
}

interface NavbarActionsProps {
  linkClassName?: string
}

const NavbarActions = (props: NavbarActionsProps) => {
  const { linkClassName } = props

  return (
    <>
      <NavbarLink href='/' name='Draws' className={linkClassName} />
      <NavbarLink href='/liquidations' name='Liquidations' className={linkClassName} />
      <NavbarLink href='/prizes' name='Prizes' className={linkClassName} />
      <NavbarLink href='/reserve' name='Reserve' className={linkClassName} />
    </>
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
        'font-semibold border-b-2 md:text-xl md:border-b-4',
        {
          'text-pt-purple-500 border-b-current': isActive,
          'text-gray-600 border-b-transparent hover:text-pt-purple-500': !isActive
        },
        className
      )}
    >
      {name}
    </Link>
  )
}
