import { LINKS } from '@shared/ui'
import { Layout } from '@components/Layout'
import { ResourceLink } from '@components/ResourceLink'
import { SimpleSection } from '@components/SimpleSection'

export default function ChatBotsPage() {
  return (
    <Layout className='gap-6'>
      <h1 className='w-full text-5xl'>Deposit/Withdraw Chat Bots</h1>
      <hr className='w-full border-pt-purple-300' />
      <div className='w-full grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2'>
        <SimpleSection
          title={`What's the idea?`}
          content={
            <p>
              In recent months, interacting with blockchains via chat bots has become quite popular.
              If users want to do so with PoolTogether, we'd be happy to support builders interested
              in building out these kind of interactions.
            </p>
          }
        />
        <div className='flex flex-col gap-6'>
          <SimpleSection
            title='Connect with the community'
            content={
              <div className='flex flex-col gap-4 items-start'>
                <ResourceLink href={LINKS.discord}>Chat with us in #incentives</ResourceLink>
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
                <ResourceLink href='https://www.npmjs.com/package/@generationsoftware/hyperstructure-client-js'>
                  PoolTogether Client SDK
                </ResourceLink>
              </div>
            }
          />
        </div>
      </div>
    </Layout>
  )
}
