import { useScreenSize } from '@shared/generic-react-hooks'
import { Button, LINKS } from '@shared/ui'
import classNames from 'classnames'
import Image from 'next/image'

interface ToolsHeaderProps {
  className?: string
}

export const ToolsHeader = (props: ToolsHeaderProps) => {
  const { className } = props

  const { isMobile } = useScreenSize()

  return (
    <div className={classNames('w-full', className)}>
      <div className='w-full flex flex-col items-center'>
        <Image
          src='/unicorn.png'
          alt='Cabana Flamingo'
          width={206}
          height={176}
          priority={true}
          className='w-44 h-auto'
        />
        <div className='flex flex-col items-center mt-2 mb-8 px-4 text-center md:mt-6 md:mb-10'>
          <h2 className='text-3xl font-medium md:text-5xl'>Build on PoolTogether & Cabana</h2>
          {/* TODO: add more accurate live data here (# of users, # of blockchains deployed) */}
          <h3 className='md:text-xl'>Connect with 50,000+ real users across many blockchains</h3>
        </div>
        <div className='flex flex-col gap-4 items-center md:flex-row'>
          <Button
            href={LINKS.tutorials}
            color='purple'
            size={isMobile ? 'md' : 'lg'}
            fullSized={isMobile}
          >
            Watch Tutorials
          </Button>
          <Button
            href={LINKS.toolDocs}
            color='purple'
            size={isMobile ? 'md' : 'lg'}
            fullSized={isMobile}
            outline={true}
          >
            Read the Docs
          </Button>
        </div>
      </div>
    </div>
  )
}
