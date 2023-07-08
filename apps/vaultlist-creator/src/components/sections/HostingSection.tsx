import classNames from 'classnames'
import { ReactNode } from 'react'

interface HostingSectionProps {
  className?: string
}

export const HostingSection = (props: HostingSectionProps) => {
  const { className } = props

  return (
    <section className={classNames('flex flex-col gap-4 items-center', className)}>
      <h2 className='text-2xl font-medium'>Host Your Vault List</h2>
      <ENSCard />
      <SelfHostingCard />
    </section>
  )
}

const ENSCard = () => (
  <InfoCard title='IPFS + ENS'>
    <span className='text-pt-purple-100'>
      This will allow you to share your vault list through your ENS domain.
    </span>
    <span>1. Pin your vault list JSON to IPFS and copy the resulting IPFS hash.</span>
    <span className='ml-4 text-sm text-pt-purple-100'>
      If you have the handy <ExternalLink id='ipfsCompanion' /> installed, this is as easy as saving
      your vault list as a JSON file and dragging and dropping it into the extension. If not, try
      using the <ExternalLink id='ipfsDesktop' />.
    </span>
    <span>2. Add the IPFS hash to a "vaultList" record on your ENS domain.</span>
    <span className='ml-4 text-sm text-pt-purple-100'>
      Head to your domain on the <ExternalLink id='ensApp' />, select "Records", "Edit Records" and
      "Add Record". The name of the record should be "vaultList", and its value should be the IPFS
      hash you've gotten from the previous step. Don't forget to save!
    </span>
  </InfoCard>
)

const SelfHostingCard = () => (
  <InfoCard title='Self-Hosting'>
    <span className='text-pt-purple-100'>
      Alternatively, host your vault list through your own website.
    </span>
    <span>1. Add a new route to your site.</span>
    <span className='ml-4 text-sm text-pt-purple-100'>
      This step will depend on what web framework your site is built on - check out how it's done on{' '}
      <ExternalLink id='nextRoutes' /> or <ExternalLink id='svelteRoutes' />.
    </span>
    <span>2. Return the vault list's JSON through your route.</span>
    <span className='ml-4 text-sm text-pt-purple-100'>
      This will also somewhat depend on your web framework of choice, but essentially just means
      sending a response of pure JSON, without any HTML!
    </span>
  </InfoCard>
)

interface InfoCardProps {
  title: string
  children: ReactNode
  className?: string
}

const InfoCard = (props: InfoCardProps) => {
  const { title, children, className } = props

  return (
    <div
      className={classNames(
        'w-full flex flex-col gap-3 px-8 py-6 bg-pt-transparent rounded-2xl',
        className
      )}
    >
      <h3 className='text-2xl font-medium'>{title}</h3>
      {children}
    </div>
  )
}

interface ExternalLinkProps {
  id: 'ipfsCompanion' | 'ipfsDesktop' | 'ensApp' | 'nextRoutes' | 'svelteRoutes'
}

const ExternalLink = (props: ExternalLinkProps) => {
  const { id } = props

  const links = {
    ipfsCompanion: {
      text: 'IPFS Companion',
      url: 'https://docs.ipfs.tech/install/ipfs-companion/'
    },
    ipfsDesktop: { text: 'Desktop App', url: 'https://docs.ipfs.tech/how-to/desktop-app/' },
    ensApp: { text: 'ENS App', url: 'https://app.ens.domains/' },
    nextRoutes: {
      text: 'NextJS',
      url: 'https://nextjs.org/docs/pages/building-your-application/routing/api-routes'
    },
    svelteRoutes: { text: 'SvelteKit', url: 'https://learn.svelte.dev/tutorial/get-handlers' }
  }

  return (
    <a href={links[id].url} target='_blank' className='font-medium underline'>
      {links[id].text}
    </a>
  )
}
