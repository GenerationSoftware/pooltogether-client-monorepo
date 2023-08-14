import { Button, LINKS } from '@shared/ui'
import classNames from 'classnames'
import Image from 'next/image'

interface HomeHeaderProps {
  className?: string
}

export const HomeHeader = (props: HomeHeaderProps) => {
  const { className } = props

  return (
    <div className={classNames('w-full isolate', className)}>
      <div className='w-full flex flex-col items-center'>
        <Image
          src='/flamingo.png'
          alt='Cabana Flamingo'
          width={188}
          height={188}
          priority={true}
          className='w-44 h-auto z-10'
        />
        <div className='flex flex-col items-center mt-6 mb-10 text-center z-10'>
          <h2 className='text-5xl font-medium'>Save to Win</h2>
          <h3 className='text-xl'>Deposit for a chance to win big, without losing.</h3>
        </div>
        <Button href={LINKS.app} color='purple' size='lg' className='z-10'>
          Launch App
        </Button>
      </div>
      <HeaderWave />
    </div>
  )
}

const HeaderWave = () => {
  return (
    <div className='w-full flex flex-col -mt-20 bg-pt-purple-600 isolate pointer-events-none'>
      <span className='w-full h-32 -mb-[1px] bg-pt-purple-700 z-10' />
      <Image
        src='/headerWave.svg'
        alt='Header Wave'
        width={1440}
        height={190}
        priority={true}
        className='w-full drop-shadow-[0_20px_20px_#8050E3]'
      />
    </div>
  )
}
