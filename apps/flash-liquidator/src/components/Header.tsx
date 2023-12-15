import { LINKS } from '@shared/ui'
import classNames from 'classnames'
import Link from 'next/link'

interface HeaderProps {
  className?: string
}

export const Header = (props: HeaderProps) => {
  const { className } = props

  return (
    <div className={classNames('flex flex-col gap-2 items-center text-center px-6', className)}>
      <h1 className='text-lg md:text-3xl'>Earn POOL by flash liquidating PoolTogether yield</h1>
      <p className='text-xs text-pt-purple-300 md:text-sm md:font-semibold'>
        Help liquidate yield from prize vaults, and potentially profit while you do it! Read the{' '}
        <Link href={LINKS.flashDocs} target='_blank' className='text-pt-teal'>
          docs
        </Link>{' '}
        for more details.
      </p>
    </div>
  )
}
