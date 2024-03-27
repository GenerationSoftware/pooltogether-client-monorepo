import { LINKS } from '@shared/ui'
import { Layout } from '@components/Layout'
import { RecipesPageContent } from '@components/RecipesPageContent'
import { ResourceLink } from '@components/ResourceLink'

export default function NoLossMarketingPage() {
  return (
    <Layout className='gap-6'>
      <RecipesPageContent
        title='No Loss Marketing'
        description='Attract users with prizes, without ever spending your budget'
        instructions={
          <>
            <li>
              Choose prize vault(s) in which you have a balance. If you don't have any yet, deposit
              through the <ResourceLink href={LINKS.app}>Cabana App</ResourceLink>.
            </li>
            <li>
              Collect user addresses you would like to delegate to. Some example methods could be
              addresses that have completed specific onchain actions, participants in some event,
              etc.
            </li>
            <li>Delegate to your users!</li>
            <span>
              Each prize vault balance can be delegated to a single user address. You can do so
              easily through the "delegate" button on the{' '}
              <ResourceLink href={LINKS.app}>Cabana App</ResourceLink>. To delegate a vault balance
              to two user addresses, send some of the balance to another wallet, and delegate
              through that.
            </span>
            <span className='text-pt-purple-300'>
              *A multidelegator app is being developed to facilitate delegating to multiple user
              addresses from a single vault balance, and will be available soon!
            </span>
          </>
        }
        ingredients={['1+ Prize Vault Balance(s)', 'Any User Addresses']}
        resources={[
          { name: 'Cabana App', href: LINKS.app },
          // TODO: update once we have a working multidelegator app
          { name: 'Multidelegator App (Coming Soon)', href: '' }
        ]}
      />
    </Layout>
  )
}
