import { LINKS } from '@shared/ui'
import { Layout } from '@components/Layout'
import { RecipesPageContent } from '@components/RecipesPageContent'
import { ResourceLink } from '@components/ResourceLink'

export default function AirdropsPage() {
  return (
    <Layout className='gap-6'>
      <RecipesPageContent
        title='No Code Airdrops'
        description='Use TWAB rewards to airdrop tokens to vault depositoooors'
        instructions={
          <>
            <li>
              Choose the prize vault you want to airdrop tokens to. You can deploy your own using
              the <ResourceLink href={LINKS.vaultFactory}>Cabana Factory</ResourceLink> app if you
              so wish.
            </li>
            <li>
              Go to the <ResourceLink href={LINKS.rewardsBuilder}>Cabana Rewards</ResourceLink> app
              and click on "Deploy New Rewards".
            </li>
            <li>
              Use the network and address of the prize vault you want to airdrop to, and following
              the rest of the instructions on the app to finely tune your distribution.
            </li>
            <li>
              If you haven't yet, connect your wallet to the app and approve the tokens in your
              wallet to be distributed. Once you've deployed the rewards, users in the vault you
              selected will start to receive your tokens in the rate you've configured!
            </li>
          </>
        }
        ingredients={['1 Prize Vault', 'Any Tokens To Airdrop']}
        resources={[
          { name: 'Cabana Rewards Builder', href: LINKS.rewardsBuilder },
          { name: 'Cabana Factory', href: LINKS.vaultFactory },
          { name: 'Cabana App', href: LINKS.app },
          { name: 'Cabana App Token Whitelist', href: LINKS.rewardTokenWhitelist }
        ]}
      />
    </Layout>
  )
}
