import { useScreenSize } from '@shared/generic-react-hooks'
import { Button, LINKS } from '@shared/ui'
import classNames from 'classnames'
import Image from 'next/image'

interface HomeHeaderProps {
  className?: string
}

export const HomeHeader = (props: HomeHeaderProps) => {
  const { className } = props

  const { isMobile } = useScreenSize()

  return (
    <div className={classNames('w-full isolate', className)}>
      <div className='w-full flex flex-col items-center'>
        <Image
          src='/flamingo.png'
          alt='Cabana Flamingo'
          width={176}
          height={176}
          priority={true}
          className='w-auto h-24 z-10 md:h-44'
        />
        <div className='flex flex-col items-center text-center mb-6 z-10 md:mt-6 md:mb-10'>
          <h2 className='text-3xl font-medium md:text-5xl'>Save to Win</h2>
          <h3 className='md:text-xl'>Deposit for a chance to win big, without losing.</h3>
        </div>
        <Button
          href={LINKS.app}
          target='_blank'
          color='purple'
          size={isMobile ? 'md' : 'lg'}
          className='z-10'
        >
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
        className='w-full drop-shadow-[0_10px_10px_#8050E3] md:drop-shadow-[0_20px_20px_#8050E3]'
      />
    </div>
  )
}
