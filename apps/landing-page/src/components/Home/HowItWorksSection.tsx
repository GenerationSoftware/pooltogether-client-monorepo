import classNames from 'classnames'
import Image from 'next/image'

interface HowItWorksSectionProps {
  className?: string
}

export const HowItWorksSection = (props: HowItWorksSectionProps) => {
  const { className } = props

  return (
    <section className={classNames('w-full flex flex-col gap-6 items-center md:gap-12', className)}>
      <span className='md:text-xl'>How It Works</span>
      <div className='flex flex-col gap-10 md:flex-row'>
        <HowItWorksItem
          imgSrc='/depositGraphic.svg'
          title='Deposit Assets'
          description='Deposit for a change to win'
        />
        <HowItWorksItem
          imgSrc='/prizesGraphic.svg'
          title='Win Prizes'
          description='Yield from deposits fund prizes'
        />
        <HowItWorksItem
          imgSrc='/noLossGraphic.svg'
          title='No Loss'
          description='No fees, withdraw any time'
        />
      </div>
    </section>
  )
}

interface HowItWorksItemProps {
  imgSrc: string
  title: string
  description: string
  className?: string
}

const HowItWorksItem = (props: HowItWorksItemProps) => {
  const { imgSrc, title, description, className } = props

  return (
    <div className={classNames('flex flex-col gap-3 md:gap-6', className)}>
      <Image src={imgSrc} alt={title} width={340} height={265} className='drop-shadow-lg' />
      <div className='flex flex-col gap-2 items-center text-center'>
        <span className='text-3xl font-medium'>{title}</span>
        <span className='text-xl text-pt-purple-100'>{description}</span>
      </div>
    </div>
  )
}
