import { Logo } from '@shared/ui'
import { LINKS } from '@shared/utilities'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'

interface NavbarProps {
  className?: string
}

export const Navbar = (props: NavbarProps) => {
  const { className } = props

  return (
    <div
      className={classNames(
        'w-full max-w-[1440px] flex items-center justify-between mx-auto px-4 py-10',
        'md:px-20',
        className
      )}
    >
      <Logo smLogoClassName='w-11' mdLogoClassName='w-52' />
      <PoweredByPT />
    </div>
  )
}

const PoweredByPT = () => {
  return (
    <Link href={LINKS.protocolLandingPage} target='_blank' className='flex flex-col items-center'>
      <span className='text-xs text-pt-purple-200 whitespace-nowrap'>Powered by</span>
      <Image src='/ptLogo.svg' alt='PoolTogether' width={183} height={72} className='w-24 h-auto' />
    </Link>
  )
}
