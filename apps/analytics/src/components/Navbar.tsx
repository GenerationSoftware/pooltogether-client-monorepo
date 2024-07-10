import { useScreenSize } from '@shared/generic-react-hooks'
import { getNetworkNameByChainId, PRIZE_POOLS } from '@shared/utilities'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { useSelectedChainId } from '@hooks/useSelectedChainId'
import { NetworkDropdown } from './NetworkDropdown'

interface NavbarProps {
  className?: string
}

export const Navbar = (props: NavbarProps) => {
  const { className } = props

  const { chainId } = useSelectedChainId()
  const networkName = getNetworkNameByChainId(chainId ?? PRIZE_POOLS[0].chainId)

  const { isMobile } = useScreenSize()

  return (
    <>
      <div
        className={classNames(
          'flex flex-col items-center justify-between px-6 py-3 z-30',
          'min-[500px]:flex-row',
          'md:px-12 md:py-6',
          className
        )}
      >
        <Link href={`/${networkName}`} className='flex gap-1 items-center'>
          <Image src='/cabanaLogo.svg' alt='Cabana' width={32} height={32} priority={true} />
          <span className='-mt-[.2rem] font-grotesk font-bold text-[2rem] text-pt-purple-100'>
            Cabanalytics
          </span>
        </Link>
        <div className='hidden gap-6 items-center md:flex'>
          <NavbarActions />
          <NetworkDropdown />
          <Image
            src='/pooly.svg'
            alt='Pooly'
            width={93}
            height={91}
            className='w-20 h-auto -ml-10'
            priority={true}
          />
        </div>
        {isMobile && <NetworkDropdown />}
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
        'fixed bottom-0 flex w-full h-[60px] justify-center items-center gap-3 font-medium text-sm',
        'bg-pt-purple-800 border-t-2 border-pt-purple-700',
        'min-[350px]:text-base min-[400px]:gap-6',
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

  const { chainId } = useSelectedChainId()
  const networkName = getNetworkNameByChainId(chainId ?? PRIZE_POOLS[0].chainId)

  return (
    <>
      <NavbarLink href={`/${networkName}/`} name='Stats' className={linkClassName} />
      <NavbarLink href={`/${networkName}/draws`} name='Draws' className={linkClassName} />
      <NavbarLink
        href={`/${networkName}/liquidations`}
        name='Liquidations'
        className={linkClassName}
      />
      <NavbarLink href={`/${networkName}/prizes`} name='Prizes' className={linkClassName} />
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

  const isActive = href.split('/')[2] === (router.pathname.split('/')[2] ?? '')

  return (
    <Link
      href={href}
      target={href.startsWith('http') ? '_blank' : '_self'}
      className={classNames(
        'font-semibold border-b-2 md:border-b-4',
        {
          'text-pt-teal border-b-current': isActive,
          'text-base border-b-transparent hover:text-pt-purple-200': !isActive
        },
        className
      )}
    >
      {name}
    </Link>
  )
}
