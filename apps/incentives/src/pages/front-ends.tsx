import { LINKS } from '@shared/ui'
import classNames from 'classnames'
import { ReactNode } from 'react'
import { BasicList } from '@components/BasicList'
import { Layout } from '@components/Layout'
import { ResourceLink } from '@components/ResourceLink'

export default function FrontEndsPage() {
  return (
    <Layout className='gap-6'>
      <h1 className='w-full text-5xl'>Frontend Incentives</h1>
      <hr className='w-full border-pt-purple-300' />
      <div className='w-full grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2'>
        <Section
          title='What needs to be done?'
          content={
            <>
              <p>
                PoolTogether needs frontends where users can access the protocol. To ensure the
                protocol can be accessed from a variety of interfaces, we are offering incentives
                for hosting these!
              </p>
              <p>
                There is currently a 6-month special incentive for <strong>one</strong> additional
                frontend to be made available.
              </p>
            </>
          }
        />
        <Section
          title='What is the incentive?'
          content={
            <div className='flex flex-col'>
              <span>April 1st to October 1st, 2024</span>
              <span className='text-5xl'>$500/mo</span>
              <span className='text-pt-purple-300'>
                to be paid to <strong>one</strong> frontend selected by G9 Software
              </span>
            </div>
          }
        />
        <Section
          title='Requirements'
          content={
            <BasicList>
              <li>
                Reach out to @alxx or @timcox.eth on the{' '}
                <ResourceLink href={LINKS.discord}>PoolTogether Discord</ResourceLink> to confirm if
                the incentive is still available. You can also follow any discussion in the
                #incentives channel.
              </li>
              {/* TODO: finalize requirements */}
              <li>WIP</li>
            </BasicList>
          }
        />
        <Section
          title='Details'
          content={
            <BasicList>
              <li>Incentives are retroactive, paid once a month.</li>
              <li>
                This 6-month incentive is offered by G9 Software, who will thereafter work with the
                host to apply for future ongoing funding from the PoolTogether treasury.
              </li>
            </BasicList>
          }
        />
        <Section
          title='Resources'
          content={
            <div className='flex flex-col gap-4 items-start'>
              <ResourceLink href='https://github.com/GenerationSoftware/pooltogether-client-monorepo'>
                Example: Cabana Open Source Apps' Monorepo
              </ResourceLink>
              <ResourceLink href='https://app.cabana.fi/'>Example: Cabana App</ResourceLink>
              <ResourceLink href='https://pooltime.app/'>Example: PoolTime App</ResourceLink>
              <ResourceLink href='https://www.npmjs.com/package/@generationsoftware/hyperstructure-client-js'>
                Package: PoolTogether V5 SDK
              </ResourceLink>
              <ResourceLink href='https://www.npmjs.com/package/@generationsoftware/hyperstructure-react-hooks'>
                Package: PoolTogether V5 React Hooks Library
              </ResourceLink>
              <ResourceLink href='https://app.cabana.fi/api/vaultList/default'>
                Vault List: Cabana Vault List
              </ResourceLink>
            </div>
          }
        />
      </div>
    </Layout>
  )
}

interface SectionProps {
  title: string
  content: ReactNode
  className?: string
}

const Section = (props: SectionProps) => {
  const { title, content, className } = props

  return (
    <section className={classNames('flex flex-col gap-2 text-xl', className)}>
      <span className='text-pt-purple-300 font-semibold'>{title}</span>
      {content}
    </section>
  )
}
