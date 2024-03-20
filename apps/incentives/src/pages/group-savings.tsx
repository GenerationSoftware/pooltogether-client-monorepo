import { LINKS } from '@shared/ui'
import { Layout } from '@components/Layout'
import { RecipesPageContent } from '@components/RecipesPageContent'
import { ResourceLink } from '@components/ResourceLink'

export default function GroupSavingsPage() {
  return (
    <Layout className='gap-6'>
      <RecipesPageContent
        title='Group Savings'
        description='Pool up friends or family to save together'
        instructions={
          <>
            <li>
              Create a multisig with the people you want to save with. This can easily be done with
              the <ResourceLink href='https://app.safe.global/'>Safe App</ResourceLink> or the{' '}
              <ResourceLink href='https://www.party.app/'>Party App</ResourceLink>. While the number
              of users can change, always make sure to require more than 1 signature to make any
              transactions!
            </li>
            <li>
              Get everyone to pitch in some amount of tokens, and transfer them to the multisig.
            </li>
            <li>
              Convene and pick the prize vault(s) you would like to deposit in, and make the
              deposits from the multisig.
            </li>
            <li>
              As the group wins prizes, these will roll into the multisig, and the group can decide
              what to do with them.
            </li>
          </>
        }
        ingredients={['1+ Prize Vault(s)', '1 Multisig', '2+ Friends/Family']}
        resources={[
          {
            name: 'Safe App Docs',
            href: 'https://help.safe.global/'
          },
          {
            name: 'Party App Docs',
            href: 'https://partydao.notion.site/592ff02b6e1c4a0ca6fe76bc0b0cb9a4'
          },
          {
            name: 'Cabana App',
            href: LINKS.app
          }
        ]}
      />
    </Layout>
  )
}
