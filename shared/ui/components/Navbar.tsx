import { Bars3Icon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { Navbar as FlowbiteNavbar } from 'flowbite-react'
import { ReactNode } from 'react'
import { Logo } from './Logo'

export interface LinkComponentProps {
  href: string
  children: string
  className?: string
}

export interface NavbarLink {
  href: string
  name: string
}

export interface NavbarProps {
  links: NavbarLink[]
  activePage: string
  linksAs?: (props: LinkComponentProps) => JSX.Element | null
  append?: ReactNode
  onClickBrand?: () => void
  onClickSettings?: () => void
  sticky?: boolean
  intl?: { home?: string }
  className?: string
  linkClassName?: string
  mobileBottomClassName?: string
}

export const Navbar = (props: NavbarProps) => {
  const {
    links,
    activePage,
    linksAs,
    append,
    onClickBrand,
    onClickSettings,
    sticky,
    intl,
    className,
    linkClassName,
    mobileBottomClassName
  } = props

  return (
    <>
      <FlowbiteNavbar
        fluid={true}
        theme={{
          root: {
            base: 'bg-pt-bg-purple-darker text-pt-purple-50 px-8 py-4 border-b-2 border-b-pt-purple-700 border-opacity-0 isolate z-50'
          }
        }}
        className={classNames({ 'fixed w-full border-opacity-100': sticky }, className)}
      >
        {/* Left Side Branding */}
        <FlowbiteNavbar.Brand
          href={!!onClickBrand ? undefined : '/'}
          onClick={onClickBrand}
          className='cursor-pointer z-30'
        >
          <Logo smLogoClassName='w-8' mdLogoClassName='w-[150px]' />
        </FlowbiteNavbar.Brand>

        {/* Middle Content */}
        <div className='hidden grow pl-8 gap-8 z-10 md:flex lg:absolute lg:w-full lg:justify-center lg:pr-16 lg:pl-0'>
          <NavbarLinks
            links={links}
            activePage={activePage}
            Component={linksAs}
            linkClassName={linkClassName}
          />
        </div>

        {/* Right Side Content */}
        <div className='flex gap-2 items-center z-20'>
          {append}
          {!!onClickSettings && (
            <Bars3Icon
              className='h-6 w-6 text-pt-purple-50 hover:text-pt-purple-200 cursor-pointer'
              onClick={onClickSettings}
            />
          )}
        </div>
      </FlowbiteNavbar>
      <MobileNavbar className={classNames('z-50', mobileBottomClassName)}>
        <NavbarLinks
          links={[{ href: '/', name: intl?.home ?? 'Home' }, ...links]}
          activePage={activePage}
          Component={linksAs}
          linkClassName={linkClassName}
        />
      </MobileNavbar>
    </>
  )
}

interface NavbarLinksProps {
  links: NavbarLink[]
  activePage: string
  Component?: (props: LinkComponentProps) => JSX.Element | null
  linkClassName?: string
}

const NavbarLinks = (props: NavbarLinksProps) => {
  const { links, activePage, Component, linkClassName } = props

  return (
    <>
      {links.map((link, i) => {
        const key = `nav-${i}-${link.name.toLowerCase()}`
        const isActiveLink = link.href === activePage
        const baseClassName = 'block text-base font-medium'
        const activeClassName = { '!text-pt-teal': isActiveLink }

        if (!!Component) {
          return (
            <Component
              key={key}
              href={link.href}
              className={classNames(baseClassName, activeClassName, linkClassName)}
            >
              {link.name}
            </Component>
          )
        } else {
          return (
            <a
              key={key}
              href={link.href}
              className={classNames(baseClassName, activeClassName, linkClassName)}
            >
              {link.name}
            </a>
          )
        }
      })}
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
