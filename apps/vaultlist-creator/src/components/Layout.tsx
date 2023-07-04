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
          'w-full max-w-screen-xl relative flex flex-col flex-grow items-center mx-auto px-4 py-8 mb-40 md:px-8',
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
    <div className='flex items-center justify-between'>
      <Image src='/ptLogo.svg' alt='PoolTogether Logo' width={183} height={72} priority={true} />
      <span className=''>Vault List Creator</span>
    </div>
  )
}

const SimpleFooter = () => {
  return (
    <footer className='flex justify-center'>
      <span>
        Made with ❤️ & 🤖 by{' '}
        <a href='https://g9software.xyz' target='_blank'>
          Generation Software
        </a>
      </span>
    </footer>
  )
}
