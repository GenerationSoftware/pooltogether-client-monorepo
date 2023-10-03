import classNames from 'classnames'
import Image from 'next/image'

interface HeaderProps {
  className?: string
}

export const Header = (props: HeaderProps) => {
  const { className } = props

  return (
    <div className={classNames('w-full flex flex-col items-center text-center', className)}>
      <Image
        src='/partyPopper.svg'
        width={157}
        height={155}
        alt='Party Popper'
        priority={true}
        className='w-40 h-auto'
      />
      <h2 className='mt-4 font-grotesk font-semibold text-5xl'>Save to Win</h2>
      <p className='mt-2 text-xl text-pt-purple-100'>
        Hold PoolTogether prize tokens for a chance to win prizes. Swap back or withdraw the
        underlying deposit from PoolTogether at any time.
      </p>
    </div>
  )
}
