import classNames from 'classnames'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { AppView } from 'src/types'

interface LayoutProps {
  appView: AppView
  children: ReactNode
  className?: string
}

export const Layout = (props: LayoutProps) => {
  const { appView, children, className } = props

  return (
    <div className='flex flex-col min-h-screen overflow-x-hidden'>
      <Head>
        <title>Cabana Lists</title>
      </Head>

      <SimpleNavbar />

      <main
        className={classNames(
          'w-full min-h-[calc(100vh-16rem)] max-w-[1440px] relative flex flex-col items-center mx-auto lg:px-4',
          className
        )}
      >
        {children}
      </main>

      <SimpleFooter className={classNames({ 'mb-16 lg:mb-0': appView === 'editing' })} />
    </div>
  )
}

const SimpleNavbar = (props: { className?: string }) => {
  const router = useRouter()

  return (
    <div
      className={classNames(
        'flex flex-col gap-6 items-center justify-between pt-6 pb-8 px-12 z-30 lg:h-36 lg:flex-row lg:pt-0 lg:pb-0',
        props.className
      )}
    >
      <Image
        src='/cabanaLogo.svg'
        alt='PoolTogether Logo'
        width={177}
        height={60}
        priority={true}
        onClick={() => router.reload()}
        className='w-52 h-auto cursor-pointer'
      />
    </div>
  )
}

const SimpleFooter = (props: { className?: string }) => {
  return (
    <footer
      className={classNames(
        'h-28 flex items-center justify-center mt-auto px-2 z-20 lg:px-12',
        props.className
      )}
    >
      <span className='text-center text-sm font-medium'>
        Made with ❤️ & 🤖 by{' '}
        <a href='https://g9software.xyz' target='_blank' className='hover:text-pt-teal'>
          Generation Software
        </a>
      </span>
    </footer>
  )
}
