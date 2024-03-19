import { LINKS } from '@shared/ui'
import { ExtensionsPageContent } from '@components/ExtensionsPageContent'
import { Layout } from '@components/Layout'

export default function OnRampsPage() {
  return (
    <Layout className='gap-6'>
      <ExtensionsPageContent
        title='Web 2.5 On-Ramps'
        idea={
          <>
            <p>
              One of the biggest challenges users face in using DeFi protocols like PoolTogether is
              the onboarding phase of wallet management and funding. Tools like smart/abstracted
              wallets and simple fiat-to-crypto on-ramps can alleviate some of this friction.
            </p>
            <p>
              We welcome any builders to build new front-ends that abstract out these challenges to
              new PoolTogether users. We can provide you with tooling and help through our many
              social channels, as well as funding if necessary. Come chat with us!
            </p>
          </>
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
            name: 'SvelteKit App Template',
            href: 'https://github.com/GenerationSoftware/pooltogether-sveltekit-template'
          },
          {
            name: 'NextJS App Template',
            href: 'https://github.com/GenerationSoftware/pooltogether-nextjs-template'
          },
          {
            name: 'PoolTogether Client SDK',
            href: 'https://www.npmjs.com/package/@generationsoftware/hyperstructure-client-js'
          },
          {
            name: 'PoolTogether React Hooks',
            href: 'https://www.npmjs.com/package/@generationsoftware/hyperstructure-react-hooks'
          }
        ]}
      />
    </Layout>
  )
}
