import { Button, ExternalLink, LINKS } from '@shared/ui'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'
import { Layout } from '@components/Layout'
import { ResourceLink } from '@components/ResourceLink'

export default function HomePage() {
  return (
    <Layout className='gap-40'>
      <HeroSection />
      <IncentivesSection />
      <RecipesSection />
      <ExtensionsSection />
      <ContactSection />
      <FaqSection />
    </Layout>
  )
}

interface SectionProps {
  className?: string
}

// TODO: update section
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
      <h3 className='text-5xl sm:text-6xl'>3 ways to earn incentives</h3>
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
        <span className='font-medium line-clamp-1'>{title}</span>
        <span className='text-pt-purple-400 line-clamp-1'>{subtitle}</span>
        <p className='line-clamp-3 md:line-clamp-2'>{description}</p>
      </div>
    </Link>
  )
}

const RecipesSection = (props: SectionProps) => {
  const { className } = props

  return (
    <section className={classNames('w-full flex flex-col items-center text-center', className)}>
      <span className='text-2xl text-pt-purple-300'>Build on PoolTogether with</span>
      <h3 className='text-5xl sm:text-6xl'>No-Code DeFi Recipes</h3>
      <div className='w-full grid grid-cols-1 gap-x-4 gap-y-6 mt-6 md:grid-cols-2'>
        <RecipeCard
          title='No-Code Airdrops'
          description='Reward the most based community in DeFi'
          href='/airdrops'
          img={{ src: '/airdrops.svg', width: 339, height: 200 }}
        />
        <RecipeCard
          title='Group Savings'
          description='Save and win with friends'
          href='/group-savings'
          img={{ src: '/groupSavings.svg', width: 339, height: 200 }}
        />
        <RecipeCard
          title='No Loss Marketing'
          description='Delegate prizes to users, withdraw anytime'
          href='/no-loss-marketing'
          img={{ src: '/marketing.svg', width: 339, height: 200 }}
        />
        <RecipeCard
          title='50/50 Yield/Prizes'
          description='Convert only half of your yield into prizes'
          href='/yield-split'
          img={{ src: '/yieldSplit.svg', width: 339, height: 200 }}
        />
      </div>
    </section>
  )
}

interface RecipeCardProps {
  title: string
  description: string
  href: string
  img: { src: string; width: number; height: number }
  className?: string
}

const RecipeCard = (props: RecipeCardProps) => {
  const { title, description, href, img, className } = props

  return (
    <Link href={href}>
      <div
        className={classNames(
          'flex flex-col gap-2 p-3 text-start rounded-lg',
          'hover:bg-pt-transparent',
          className
        )}
      >
        <Image {...img} alt={title} className='w-full h-auto' />
        <span className='text-2xl font-medium line-clamp-1'>{title}</span>
        <p className='text-xl text-pt-purple-300 line-clamp-2 md:line-clamp-1'>{description}</p>
      </div>
    </Link>
  )
}

const ExtensionsSection = (props: SectionProps) => {
  const { className } = props

  return (
    <section className={classNames('w-full flex flex-col items-center text-center', className)}>
      <span className='text-2xl text-pt-purple-300'>PoolTogether</span>
      <h3 className='text-5xl sm:text-6xl'>Requests for Extensions</h3>
      <div className='w-full grid grid-cols-1 gap-4 mt-6 md:grid-cols-3'>
        <ExtensionCard
          title='Yield Sources'
          description='Integrate new yield sources with PTV5'
          href='/yield-sources'
          img={{ src: '/yieldSources.svg', width: 212, height: 126 }}
        />
        <ExtensionCard
          title='Web 2.5 On-Ramps'
          description='Make it easy to on-ramp from fiat to PTV5'
          href='/on-ramps'
          img={{ src: '/onRamps.svg', width: 212, height: 126 }}
        />
        <ExtensionCard
          title='Chat Bots'
          description='Create deposit/withdraw bots for Telegram or Discord'
          href='/chat-bots'
          img={{ src: '/chatBots.svg', width: 212, height: 126 }}
        />
      </div>
    </section>
  )
}

interface ExtensionCardProps {
  title: string
  description: string
  href: string
  img: { src: string; width: number; height: number }
  className?: string
}

const ExtensionCard = (props: ExtensionCardProps) => {
  const { title, description, href, img, className } = props

  return (
    <Link href={href}>
      <div
        className={classNames(
          'flex flex-col gap-2 p-3 text-start rounded-lg',
          'hover:bg-pt-transparent',
          className
        )}
      >
        <Image {...img} alt={title} className='w-full h-auto' />
        <span className='text-2xl font-medium line-clamp-1'>{title}</span>
        <p className='text-xl text-pt-purple-300 line-clamp-3 md:line-clamp-2'>{description}</p>
      </div>
    </Link>
  )
}

const ContactSection = (props: SectionProps) => {
  const { className } = props

  return (
    <section className={classNames('w-full flex flex-col items-center text-center', className)}>
      <span className='text-2xl font-medium'>Want to build something on PoolTogether V5?</span>
      <Button href={LINKS.governance} target='_blank' color='darkPurple' className='mt-6'>
        Share your idea on the governance forum
      </Button>
      <ExternalLink href={LINKS.discord} size='sm' className='mt-3 underline'>
        Chat with the community on Discord
      </ExternalLink>
    </section>
  )
}

const FaqSection = (props: SectionProps) => {
  const { className } = props

  return (
    <section className={classNames('w-full flex flex-col gap-6', className)}>
      <h3 className='text-5xl font-medium text-pt-purple-300 sm:text-6xl'>FAQs</h3>
      <div className='flex flex-col gap-6'>
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
          q='How do I go about building on PoolTogether?'
          a={
            <>
              <p>
                PoolTogether is completely permissionless. If you want to build something on top or
                related to it, just go ahead and do it! You can get started with the{' '}
                <ResourceLink href='https://dev.pooltogether.com/protocol/design/'>
                  dev docs
                </ResourceLink>
                , UI templates such as the ones for{' '}
                <ResourceLink href='https://github.com/GenerationSoftware/pooltogether-sveltekit-template'>
                  SvelteKit
                </ResourceLink>{' '}
                or{' '}
                <ResourceLink href='https://github.com/GenerationSoftware/pooltogether-nextjs-template'>
                  NextJS
                </ResourceLink>
                , or{' '}
                <ResourceLink href='https://www.npmjs.com/package/@generationsoftware/hyperstructure-client-js'>
                  G9's SDK
                </ResourceLink>{' '}
                for interacting with the protocol.
              </p>
            </>
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
          q='Do I need to buy POOL to make a budget request?'
          a={
            <>
              <p>
                While making a proposal onchain requires 10,000 POOL tokens, there are plenty of
                community members that are happy to sponsor worthwhile proposals. Simply bring the
                topic of sponsorship when discussing your proposal.
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
      <span className='text-2xl font-medium text-pt-purple-300'>{q}</span>
      <span className='text-xl'>{a}</span>
    </div>
  )
}
