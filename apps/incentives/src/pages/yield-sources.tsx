import { LINKS } from '@shared/ui'
import { ExtensionsPageContent } from '@components/ExtensionsPageContent'
import { Layout } from '@components/Layout'

export default function YieldSourcesPage() {
  return (
    <Layout className='gap-6'>
      <ExtensionsPageContent
        title='New Yield Sources'
        idea={
          <>
            <p>
              PoolTogether relies on yield sources to generate prizes. However, to keep users safe,
              these yield sources need due diligence and proper auditing. Furthermore, the
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
        communityLinks={[
          {
            name: 'Chat with us in #incentives',
            href: LINKS.discord
          },
          {
            name: 'Discuss yield sources in the forums',
            href: 'https://gov.pooltogether.com/c/ideas-and-discussion'
          },
          {
            name: 'Post a PTBR to request funding',
            href: 'https://gov.pooltogether.com/c/governance/budget-requests'
          }
        ]}
        resources={[{ name: 'PoolTogether V5 Dev Docs', href: LINKS.protocolDevDocs }]}
      />
    </Layout>
  )
}
