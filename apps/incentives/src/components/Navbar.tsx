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
        'flex items-center justify-between px-6 py-3 z-30',
        'md:px-24 md:py-12',
        className
      )}
    >
      <Link href='/'>
        <Image
          src='/ptLogo.svg'
          alt='PoolTogether'
          width={183}
          height={72}
          className='w-24 h-auto md:w-36'
        />
      </Link>
      {/* TODO: need styling and logic (only display when not on home page) */}
      <span>Back</span>
    </div>
  )
}
