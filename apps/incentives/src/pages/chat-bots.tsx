import { LINKS } from '@shared/ui'
import { ExtensionsPageContent } from '@components/ExtensionsPageContent'
import { Layout } from '@components/Layout'

export default function ChatBotsPage() {
  return (
    <Layout className='gap-6'>
      <ExtensionsPageContent
        title='Deposit/Withdraw Chat Bots'
        idea={
          <p>
            In recent months, interacting with blockchains via chat bots has become quite popular.
            If users want to do so with PoolTogether, we'd be happy to support builders interested
            in building out these kind of interactions.
          </p>
        }
        communityLinks={[
          {
            name: 'Chat with us in #incentives',
            href: LINKS.discord
          },
          {
            name: 'Post a PTBR to request funding',
            href: 'https://gov.pooltogether.com/c/governance/budget-requests'
          }
        ]}
        resources={[
          {
            name: 'PoolTogether V5 Dev Docs',
            href: LINKS.protocolDevDocs
          },
          {
            name: 'PoolTogether Client SDK',
            href: 'https://www.npmjs.com/package/@generationsoftware/hyperstructure-client-js'
          }
        ]}
      />
    </Layout>
  )
}
