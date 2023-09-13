import classNames from 'classnames'
import Head from 'next/head'
import { ReactNode } from 'react'
import { Navbar } from './Navbar'

interface LayoutProps {
  children: ReactNode
  className?: string
}

export const Layout = (props: LayoutProps) => {
  const { children, className } = props

  return (
    <div className='flex flex-col min-h-screen overflow-x-hidden'>
      <Head>
        <title>Cabanalytics</title>
      </Head>

      <Navbar />

      <main
        className={classNames(
          'w-full max-w-7xl relative flex flex-col flex-grow items-center mx-auto mb-20',
          className
        )}
      >
        {children}
      </main>
    </div>
  )
}
