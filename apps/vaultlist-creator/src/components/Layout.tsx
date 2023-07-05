import classNames from 'classnames'
import Image from 'next/image'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  className?: string
}

export const Layout = (props: LayoutProps) => {
  const { children, className } = props

  return (
    <div className='flex flex-col min-h-screen'>
      <SimpleNavbar />
      <main
        className={classNames(
          'w-full max-w-screen-xl relative flex flex-col flex-grow items-center mx-auto px-4',
          className
        )}
      >
        {children}
      </main>
      <SimpleFooter />
    </div>
  )
}

const SimpleNavbar = () => {
  return (
    <div className='flex items-center justify-between p-12'>
      <Image
        src='/ptLogo.svg'
        alt='PoolTogether Logo'
        width={183}
        height={72}
        priority={true}
        className='w-28 h-auto'
      />
      <span className='text-4xl'>Vault List Creator</span>
    </div>
  )
}

const SimpleFooter = () => {
  return (
    <footer className='flex justify-center p-12'>
      <span className='text-sm font-medium'>
        Made with ❤️ & 🤖 by{' '}
        <a href='https://g9software.xyz' target='_blank' className='hover:text-pt-teal'>
          Generation Software
        </a>
      </span>
    </footer>
  )
}
