import { Button, LINKS } from '@shared/ui'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'
import { Layout } from '@components/Layout'
import { ResourceLink } from '@components/ResourceLink'

export default function HomePage() {
  return (
    <Layout>
      <HeroSection />
      <IncentivesSection className='mt-24' />
      <FaqSection className='mt-48' />
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
      <h1 className='text-5xl sm:text-6xl'>
        Help <span className='text-pt-purple-300'>Run</span> The{' '}
        <span className='text-pt-purple-300'>Hyperstructure</span>
      </h1>
      <Image
        src='/heroGraphic.svg'
        alt='Fancy Hero Image'
        width={761}
        height={340}
        priority={true}
        className='w-full h-auto'
      />
      <h2 className='text-2xl'>
        We provide the <span className='font-semibold text-pt-purple-300'>tools</span> &{' '}
        <span className='font-semibold text-pt-purple-300'>incentives</span>. You run the
        hyperstructure.
      </h2>
      <div className='flex flex-col gap-6 items-center sm:flex-row'>
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
      <h3 className='text-5xl sm:text-6xl'>5 ways to earn incentives</h3>
      <div className='w-full grid grid-cols-1 gap-4 mt-6 md:grid-cols-3'>
        <IncentiveCard
          title='Yield Liquidation Bot'
          subtitle='Earn liquidation fees'
          description='Swap yield at a discount and build up the prize pool'
          href='/yield-bots'
          img={{ src: '/yieldBots.svg', width: 213, height: 133 }}
        />
        <IncentiveCard
          title='Prize Claimer Bot'
          subtitle='Earn claim fees'
          description='Claim prizes for winners and earn a claim fee'
          href='/claimer-bots'
          img={{ src: '/claimerBots.svg', width: 213, height: 133 }}
        />
        <IncentiveCard
          title='Draw Auction Bot'
          subtitle='Earn reserve rewards'
          description='Generate a random # and trigger prize draws'
          href='/draw-bots'
          img={{ src: '/drawBots.svg', width: 213, height: 133 }}
        />
      </div>
      <div className='w-full grid grid-cols-1 gap-4 mt-6 md:grid-cols-2'>
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
        <p className='line-clamp-3 md:line-clamp-2'>{description}</p>
      </div>
    </Link>
  )
}

const FaqSection = (props: SectionProps) => {
  const { className } = props

  return (
    <section className={classNames('w-full flex flex-col gap-6', className)}>
      <h3 className='text-5xl text-pt-purple-300 sm:text-6xl'>FAQs</h3>
      <div className='flex flex-col gap-12'>
        <FAQ
          q='Where can I learn more about PoolTogether V5 bots?'
          a={
            <p>
              Check out some of{' '}
              <ResourceLink href='https://mirror.xyz/0x49ca801A80e31B1ef929eAB13Ab3FBbAe7A55e8F'>
                G9's bot creation tutorials on Mirror
              </ResourceLink>
              , read the{' '}
              <ResourceLink href='https://dev.pooltogether.com/protocol/design/'>
                dev docs
              </ResourceLink>{' '}
              to learn more about the protocol's design, or come chat with us on{' '}
              <ResourceLink href={LINKS.discord}>Discord</ResourceLink>.
            </p>
          }
        />
        <FAQ
          q='How much can I earn by running bots?'
          a={
            <>
              <p>
                This can vary greatly between different types of bots, and their efficiency. Since
                these incentives are built into the protocol, there can be substantial competition
                between bots. As the protocol grows and more yield flows through the hyperstructure,
                there are more incentives and more room for additional bots to compete. Check each
                type of bot above for an estimate of what is up for grabs.
              </p>
            </>
          }
        />
        <FAQ
          q='Who administers these incentives programs?'
          a={
            <>
              <p>
                Bot incentives are built into the protocol, either through the prize pool directly
                or through the many vaults connected to it. There can be, however, additional
                incentives managed offchain from third parties contributing to the protocol's
                growth. See more details in each type of incentive's' pages above.
              </p>
            </>
          }
        />
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
    <div className={classNames('flex flex-col gap-6', className)}>
      <span className='text-2xl text-pt-purple-300'>{q}</span>
      <span className='flex flex-col gap-2 text-xl'>{a}</span>
    </div>
  )
}
