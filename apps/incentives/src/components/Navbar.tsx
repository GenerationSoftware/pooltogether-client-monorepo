import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface NavbarProps {
  className?: string
}

export const Navbar = (props: NavbarProps) => {
  const { className } = props

  const router = useRouter()

  return (
    <div
      className={classNames('flex items-center justify-between px-9 pt-14 pb-4 z-30', className)}
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
      {router.pathname !== '/' && (
        <Link href='/' className='text-lg text-pt-purple-50 md:text-2xl'>
          Go back
        </Link>
      )}
    </div>
  )
}
