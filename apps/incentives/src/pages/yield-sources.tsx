import { LINKS } from '@shared/ui'
import { Layout } from '@components/Layout'
import { ResourceLink } from '@components/ResourceLink'
import { SimpleSection } from '@components/SimpleSection'

export default function YieldSourcesPage() {
  return (
    <Layout className='gap-6'>
      <h1 className='w-full text-5xl'>New Yield Sources</h1>
      <hr className='w-full border-pt-purple-300' />
      <div className='w-full grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2'>
        <SimpleSection
          title={`What's the idea?`}
          content={
            <>
              <p>
                PoolTogether relies on yield sources to generate prizes. However, to keep users
                safe, these yield sources need due diligence and proper auditing. Furthermore, the
                interactions between a prize vault and its underlying yield source should also be
                examined closely.
              </p>
              <p>
                We invite anyone to share yield sources to be integrated with PoolTogether V5. If
                funding is necessary for audits and/or building contract wrappers, we encourage
                requesting a budget through a PTBR.
              </p>
            </>
          }
        />
        <div className='flex flex-col gap-6'>
          <SimpleSection
            title='Connect with the community'
            content={
              <div className='flex flex-col gap-4 items-start'>
                <ResourceLink href={LINKS.discord}>Chat with us in #incentives</ResourceLink>
                <ResourceLink href='https://gov.pooltogether.com/c/ideas-and-discussion'>
                  Discuss yield sources in the forums
                </ResourceLink>
                <ResourceLink href='https://gov.pooltogether.com/c/governance/budget-requests'>
                  Post a PTBR to request funding
                </ResourceLink>
              </div>
            }
          />
          <SimpleSection
            title='Resources'
            content={
              <div className='flex flex-col gap-4 items-start'>
                <ResourceLink href={LINKS.protocolDevDocs}>PoolTogether V5 Dev Docs</ResourceLink>
              </div>
            }
          />
        </div>
      </div>
    </Layout>
  )
}
