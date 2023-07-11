import { Button } from '@shared/ui'
import classNames from 'classnames'
import Link from 'next/link'

interface PageNotFoundProps {
  className?: string
}

export const PageNotFound = (props: PageNotFoundProps) => {
  const { className } = props

  return (
    <div
      className={classNames(
        'flex flex-col gap-4 items-center justify-center p-4 text-center',
        className
      )}
    >
      <span className='text-3xl'>🤔 Hmmm...</span>
      <h2 className='mb-8 font-bold text-3xl'>We couldn't find the page you're looking for.</h2>
      <Link href='/' passHref={true}>
        <Button>
          <span className='text-xl'>Return to the Pool</span>
        </Button>
      </Link>
    </div>
  )
}
