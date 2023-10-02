import { Logo } from '@shared/ui'
import classNames from 'classnames'
import Image from 'next/image'

interface NavbarProps {
  className?: string
}

export const Navbar = (props: NavbarProps) => {
  const { className } = props

  return (
    <div className={classNames('flex items-center justify-between', className)}>
      <Logo smLogoClassName='w-11' mdLogoClassName='w-52' />
      <PoweredByPT />
    </div>
  )
}

const PoweredByPT = () => {
  return (
    <div className='flex flex-col items-center'>
      <span className='text-xs text-pt-purple-200 whitespace-nowrap'>Powered by</span>
      <Image src='/ptLogo.svg' alt='PoolTogether' width={183} height={72} className='w-24 h-auto' />
    </div>
  )
}
