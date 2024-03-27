import { LINKS } from '@shared/ui'
import { Layout } from '@components/Layout'
import { RecipesPageContent } from '@components/RecipesPageContent'
import { ResourceLink } from '@components/ResourceLink'

export default function YieldSplitPage() {
  return (
    <Layout className='gap-6'>
      <RecipesPageContent
        title='50/50 Yield/Prizes Vault'
        description='Set up a vault where half the yield is directed to depositors'
        instructions={
          <>
            <li>
              Use the <ResourceLink href={LINKS.vaultFactory}>Cabana Factory</ResourceLink> app to
              create a new prize vault with a 50% yield fee and a recipient address you control
              (ideally a multisig or custom contract).
            </li>
            <li>
              Once enough yield has accrued at your defined recipient address, head to the{' '}
              <ResourceLink href={LINKS.rewardsBuilder}>Cabana Rewards</ResourceLink> app to
              distribute these to your vault's users. The app allows you to create retroactive
              distributions, meaning your users would immediately recieve tokens corresponding to
              their balances during the period the yield was accruing.
            </li>
          </>
        }
        ingredients={['1 Prize Vault', '1 Multisig']}
        resources={[
          { name: 'Cabana Factory', href: LINKS.vaultFactory },
          { name: 'Cabana Rewards Builder', href: LINKS.rewardsBuilder },
          { name: 'Cabana App', href: LINKS.app },
          { name: 'Cabana App Token Whitelist', href: LINKS.rewardTokenWhitelist }
        ]}
      />
    </Layout>
  )
}
