import { Bars3Icon } from '@heroicons/react/24/outline'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { Logo } from '@shared/ui'
import classNames from 'classnames'
import { Navbar as FlowbiteNavbar } from 'flowbite-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

interface NavbarLink {
  href: string
  name: string
}

export const Navbar = () => {
  const t_nav = useTranslations('Navigation')

  const { setIsModalOpen: setIsSettingsModalOpen } = useIsModalOpen(MODAL_KEYS.settings)

  const navLinks: NavbarLink[] = [
    { href: '/prizes', name: t_nav('prizes') },
    { href: '/vaults', name: t_nav('vaults') },
    { href: '/account', name: t_nav('account') }
  ]

  return (
    <>
      <FlowbiteNavbar
        fluid={true}
        theme={{
          root: {
            base: 'bg-pt-bg-purple-darker text-pt-purple-50 px-8 py-4 border-b-2 border-b-pt-purple-700 border-opacity-0 isolate z-50'
          }
        }}
        className='font-grotesk'
      >
        {/* Left Side Branding */}
        <Link href='/' className='cursor-pointer z-30'>
          <Logo smLogoClassName='w-8' mdLogoClassName='w-[150px]' />
        </Link>

        {/* Middle Content */}
        <div className='hidden grow pl-8 gap-8 z-10 md:flex lg:absolute lg:w-full lg:justify-center lg:pr-16 lg:pl-0'>
          <NavbarLinks links={navLinks} />
        </div>

        {/* Right Side Content */}
        <div className='flex gap-2 items-center z-20'>
          <ConnectButton
            showBalance={false}
            chainStatus={{ smallScreen: 'icon', largeScreen: 'full' }}
            accountStatus='full'
          />
          <Bars3Icon
            className='h-6 w-6 text-pt-purple-50 hover:text-pt-purple-200 cursor-pointer'
            onClick={() => setIsSettingsModalOpen(true)}
          />
        </div>
      </FlowbiteNavbar>
      <MobileNavbar className='z-50'>
        <NavbarLinks links={[{ href: '/', name: t_nav('home') }, ...navLinks]} />
      </MobileNavbar>
    </>
  )
}

interface NavbarLinksProps {
  links: NavbarLink[]
}

const NavbarLinks = (props: NavbarLinksProps) => {
  const { links } = props

  const router = useRouter()

  return (
    <>
      {links.map((link, i) => (
        <Link
          key={`nav-${i}-${link.name.toLowerCase()}`}
          href={link.href}
          className={classNames('block text-base font-medium hover:text-pt-purple-200', {
            '!text-pt-teal': link.href === router.pathname
          })}
        >
          {link.name}
        </Link>
      ))}
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
        'fixed bottom-0 flex w-full h-[60px] justify-center items-center gap-6 md:hidden',
        'bg-pt-purple-600 border-t-2 border-pt-purple-500',
        className
      )}
    >
      {children}
    </div>
  )
}
