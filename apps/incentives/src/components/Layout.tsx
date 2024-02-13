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
        <title>PoolTogether Incentives</title>
      </Head>

      <Navbar />

      <main className={classNames('w-full relative flex flex-col items-center mx-auto', className)}>
        {children}
      </main>
    </div>
  )
}
