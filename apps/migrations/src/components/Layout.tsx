import { Toaster } from '@shared/ui'
import classNames from 'classnames'
import Head from 'next/head'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  className?: string
}

export const Layout = (props: LayoutProps) => {
  const { children, className } = props

  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>Cabana Migrations</title>
      </Head>

      <Toaster />

      <main
        className={classNames(
          'w-full max-w-screen-xl relative flex flex-col items-center mx-auto px-4 py-8 mb-40 md:px-8',
          className
        )}
      >
        {children}
      </main>
    </div>
  )
}
