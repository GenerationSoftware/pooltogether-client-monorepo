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
    <div className='flex flex-col min-h-screen overflow-x-hidden'>
      <SimpleNavbar />
      <main
        className={classNames(
          'w-full min-h-[calc(100vh-16rem)] max-w-[1440px] relative flex flex-col items-center mx-auto lg:px-4',
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
    <div className='flex flex-col gap-6 items-center justify-between pt-6 pb-8 px-12 z-30 lg:h-36 lg:flex-row lg:pt-0 lg:pb-0'>
      <Image
        src='/ptLogo.svg'
        alt='PoolTogether Logo'
        width={183}
        height={72}
        priority={true}
        className='w-28 h-auto'
      />
      <span className='text-center text-2xl lg:text-4xl'>Vault List Creator</span>
    </div>
  )
}

const SimpleFooter = () => {
  return (
    <footer className='h-28 flex items-center justify-center mt-auto px-2 z-20 lg:px-12'>
      <span className='text-center text-sm font-medium'>
        Made with ❤️ & 🤖 by{' '}
        <a href='https://g9software.xyz' target='_blank' className='hover:text-pt-teal'>
          Generation Software
        </a>
      </span>
    </footer>
  )
}
