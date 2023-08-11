import classNames from 'classnames'
import Image from 'next/image'

interface HowItWorksSectionProps {
  className?: string
}

export const HowItWorksSection = (props: HowItWorksSectionProps) => {
  const { className } = props

  return (
    <section className={classNames('w-full flex flex-col gap-12 items-center', className)}>
      <span className='text-xl'>How It Works</span>
      <div className='flex gap-10'>
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
    <div className={classNames('flex flex-col', className)}>
      <Image src={imgSrc} alt={title} width={340} height={265} />
      <div className='flex flex-col gap-2 items-center text-center mt-6'>
        <span className='text-3xl font-medium'>{title}</span>
        <span className='text-xl text-pt-purple-100'>{description}</span>
      </div>
    </div>
  )
}
