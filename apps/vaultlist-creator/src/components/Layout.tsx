import { LINKS } from '@shared/ui'
import classNames from 'classnames'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
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
        'flex gap-6 items-center justify-between pt-6 pb-8 px-8 z-30 lg:h-36 lg:pt-0 lg:pb-0 lg:px-12',
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
      <a href={LINKS.listDocs} target='_blank' className='flex items-center'>
        <DocsSvg className='w-5 h-5 mr-0.5' />
        <span className='text-pt-purple-300'>Docs</span>
      </a>
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
      <div className='flex flex-col gap-2 items-center text-center'>
        <span className='text-sm font-medium'>
          Made with ❤️ & 🤖 by{' '}
          <a href='https://g9software.xyz' target='_blank' className='hover:text-pt-teal'>
            Generation Software
          </a>
        </span>
        <span className='text-xs font-medium text-pt-pink'>
          By using this app you are agreeing to our{' '}
          <Link href={LINKS.termsOfService} target='_blank' className='hover:underline'>
            Terms and Conditions
          </Link>
        </span>
      </div>
    </footer>
  )
}

const DocsSvg = (props: { className?: string; color?: string }) => (
  <svg
    viewBox='0 0 20 20'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className={props.className}
  >
    <g id='document-text'>
      <path
        id='Vector'
        fillRule='evenodd'
        clipRule='evenodd'
        d='M4 4C4 3.46957 4.21071 2.96086 4.58579 2.58579C4.96086 2.21071 5.46957 2 6 2H10.586C11.1164 2.00011 11.625 2.2109 12 2.586L15.414 6C15.7891 6.37499 15.9999 6.88361 16 7.414V16C16 16.5304 15.7893 17.0391 15.4142 17.4142C15.0391 17.7893 14.5304 18 14 18H6C5.46957 18 4.96086 17.7893 4.58579 17.4142C4.21071 17.0391 4 16.5304 4 16V4ZM6 10C6 9.73478 6.10536 9.48043 6.29289 9.29289C6.48043 9.10536 6.73478 9 7 9H13C13.2652 9 13.5196 9.10536 13.7071 9.29289C13.8946 9.48043 14 9.73478 14 10C14 10.2652 13.8946 10.5196 13.7071 10.7071C13.5196 10.8946 13.2652 11 13 11H7C6.73478 11 6.48043 10.8946 6.29289 10.7071C6.10536 10.5196 6 10.2652 6 10ZM7 13C6.73478 13 6.48043 13.1054 6.29289 13.2929C6.10536 13.4804 6 13.7348 6 14C6 14.2652 6.10536 14.5196 6.29289 14.7071C6.48043 14.8946 6.73478 15 7 15H13C13.2652 15 13.5196 14.8946 13.7071 14.7071C13.8946 14.5196 14 14.2652 14 14C14 13.7348 13.8946 13.4804 13.7071 13.2929C13.5196 13.1054 13.2652 13 13 13H7Z'
        fill={props.color ?? '#C8ADFF'}
      />
    </g>
  </svg>
)
