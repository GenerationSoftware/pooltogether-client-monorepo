import { Button, LINKS } from '@shared/ui'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'
import { Layout } from '@components/Layout'

// TODO: mobile design
export default function HomePage() {
  return (
    <Layout>
      <HeroSection />
      <IncentivesSection className='mt-24' />
      <FaqSection className='mt-48 mb-40' />
    </Layout>
  )
}

interface SectionProps {
  className?: string
}

const HeroSection = (props: SectionProps) => {
  const { className } = props

  return (
    <section
      className={classNames('w-full flex flex-col gap-6 items-center text-center', className)}
    >
      <h1 className='text-6xl'>
        Help <span className='text-pt-purple-300'>Run</span> The{' '}
        <span className='text-pt-purple-300'>Hyperstructure</span>
      </h1>
      <Image
        src='/heroGraphic.svg'
        alt='Fancy Hero Image'
        width={761}
        height={340}
        className='w-full h-auto'
      />
      <h2 className='text-2xl'>
        We provide the <span className='font-semibold text-pt-purple-300'>tools</span> &{' '}
        <span className='font-semibold text-pt-purple-300'>incentives</span>. You run the
        hyperstructure.
      </h2>
      <div className='flex gap-6 items-center'>
        <span className='text-xl'>Have questions or want to learn more?</span>
        <Button href={LINKS.discord} target='_blank' color='darkPurple'>
          Chat with us in #incentives
        </Button>
      </div>
    </section>
  )
}

const IncentivesSection = (props: SectionProps) => {
  const { className } = props

  return (
    <section className={classNames('w-full flex flex-col items-center text-center', className)}>
      <span className='text-2xl text-pt-purple-300'>PoolTogether V5 has</span>
      <h3 className='text-6xl'>5 ways to earn incentives</h3>
      <div className='grid grid-cols-3 gap-4 mt-6'>
        <IncentiveCard
          title='Yield Liquidation Bot'
          subtitle='Earn liquidation fees'
          description='Swap yield at a discount and build up the prize pool'
          href='/yield-bots'
          img={{ src: '/yieldBots.svg', width: 213, height: 139 }}
        />
        <IncentiveCard
          title='Prize Claimer Bot'
          subtitle='Earn claim fees'
          description='Claim prizes for winners and earn a claim fee'
          href='/claimer-bots'
          img={{ src: '/claimerBots.svg', width: 231, height: 142 }}
        />
        <IncentiveCard
          title='Draw Auction Bot'
          subtitle='Earn reserve rewards'
          description='Generate a random # and trigger prize draws'
          href='/draw-bots'
          img={{ src: '/drawBots.svg', width: 213, height: 139 }}
        />
      </div>
      <div className='grid grid-cols-2 gap-4 mt-6'>
        <IncentiveCard
          title='Launch a Vault'
          subtitle='Attract deposits, apply for bonus rewards'
          description='Launch vaults and get them listed on front ends, aggregators and vault lists'
          href='/vaults'
          img={{ src: '/vaults.svg', width: 339, height: 133 }}
        />
        <IncentiveCard
          title='Run a Frontend'
          subtitle='Earn $500/mo'
          description='Host a frontend to the PoolTogether protocol - build your own or fork one'
          href='/front-ends'
          img={{ src: '/frontends.svg', width: 339, height: 133 }}
        />
      </div>
    </section>
  )
}

interface IncentiveCardProps {
  title: string
  subtitle: string
  description: string
  href: string
  img: { src: string; width: number; height: number }
  className?: string
}

const IncentiveCard = (props: IncentiveCardProps) => {
  const { title, subtitle, description, href, img, className } = props

  return (
    <Link href={href}>
      <div
        className={classNames(
          'flex flex-col gap-2 p-3 text-start text-xl rounded-lg',
          'hover:bg-pt-purple-50/20',
          className
        )}
      >
        <Image {...img} alt={title} className='w-full h-auto' />
        <span className='text-2xl line-clamp-1'>{title}</span>
        <span className='text-pt-purple-300 line-clamp-1'>{subtitle}</span>
        <p className='line-clamp-2'>{description}</p>
      </div>
    </Link>
  )
}

const FaqSection = (props: SectionProps) => {
  const { className } = props

  return (
    <section className={classNames('w-full flex flex-col gap-6', className)}>
      <h3 className='text-6xl text-pt-purple-300'>FAQs</h3>
      <div className='flex flex-col gap-12'>
        {/* TODO: add proper responses */}
        <FAQ q='Where can I learn more about PoolTogether V5 bots?' a={'TODO'} />
        <FAQ q='How much can I earn by running bots?' a={'TODO'} />
        <FAQ q='Who administers these incentives programs?' a={'TODO'} />
      </div>
    </section>
  )
}

interface FaqProps {
  q: string
  a: ReactNode
  className?: string
}

const FAQ = (props: FaqProps) => {
  const { q, a, className } = props

  return (
    <div className={classNames('flex flex-col gap-6 text-2xl', className)}>
      <span className='text-pt-purple-300'>{q}</span>
      {a}
    </div>
  )
}
