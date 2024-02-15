import { DOMAINS } from '@shared/ui'
import classNames from 'classnames'
import { ReactNode } from 'react'
import { BasicList } from '@components/BasicList'
import { Layout } from '@components/Layout'
import { ResourceLink } from '@components/ResourceLink'

export default function VaultsPage() {
  return (
    <Layout className='gap-6'>
      <h1 className='w-full text-5xl'>Vault Incentives</h1>
      <hr className='w-full border-pt-purple-300' />
      <div className='w-full grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2'>
        <Section
          title='What needs to be done?'
          content={
            <>
              <p>
                PoolTogether needs yield sources to generate prizes. To keep users safe, these yield
                sources need due diligence and auditing.
              </p>
              <p>
                We are seeking developers and auditors to create and audit 8-10 additional vaults
                and/or wrappers.
              </p>
            </>
          }
        />
        <Section
          title='What is the incentive?'
          content={
            <div className='flex flex-col'>
              <span className='text-pt-purple-300'>
                The community is currently identifying vaults it seeks to integrate. Incentives will
                begin...
              </span>
              <span className='text-5xl'>
                Soon<sup className='text-2xl'>TM</sup>
              </span>
              <span className='text-pt-purple-300'>check the #incentives channel for updates</span>
            </div>
          }
        />
        <Section
          title='Requirements'
          content={
            <BasicList>
              <li>Coming soon...</li>
            </BasicList>
          }
        />
        <Section
          title='Details'
          content={
            <BasicList>
              <li>
                Join the discussion on yield sources on the{' '}
                <ResourceLink href={DOMAINS.governance}>Governance Forum</ResourceLink>.
              </li>
            </BasicList>
          }
        />
        <Section
          title='Resources'
          content={
            <div className='flex flex-col gap-4 items-start'>
              <ResourceLink href='https://dev.pooltogether.com/protocol/design/vaults'>
                Dev Docs: Vaults' Design
              </ResourceLink>
              <ResourceLink href='https://docs.cabana.fi/cabana-tools/cabana-factory'>
                Docs: Cabana Vault Factory Docs
              </ResourceLink>
              <ResourceLink href='https://factory.cabana.fi/'>
                Interface: Cabana Vault Factory
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
