import { Button, LINKS } from '@shared/ui'
import classNames from 'classnames'
import Image from 'next/image'

interface ToolsHeaderProps {
  className?: string
}

export const ToolsHeader = (props: ToolsHeaderProps) => {
  const { className } = props

  return (
    <div className={classNames('w-full', className)}>
      <div className='w-full flex flex-col items-center'>
        <Image
          src='/unicorn.png'
          alt='Cabana Flamingo'
          width={349}
          height={188}
          priority={true}
          className='w-44 h-auto'
        />
        <div className='flex flex-col items-center mt-6 mb-10 text-center'>
          <h2 className='text-5xl font-medium'>Build on PoolTogether & Cabana</h2>
          {/* TODO: add more accurate live data here (# of users, # of blockchains deployed) */}
          <h3 className='text-xl'>Connect with 50,000+ real users across many blockchains</h3>
        </div>
        {/* TODO: better docs links here */}
        <div className='flex gap-4 items-center'>
          <Button href={LINKS.docs} color='purple' size='lg'>
            Watch Tutorials
          </Button>
          <Button href={LINKS.docs} color='purple' size='lg' outline={true}>
            Read the Docs
          </Button>
        </div>
      </div>
    </div>
  )
}
