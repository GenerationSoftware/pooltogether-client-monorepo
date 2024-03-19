import { LINKS } from '@shared/ui'
import { Layout } from '@components/Layout'
import { ResourceLink } from '@components/ResourceLink'
import { SimpleSection } from '@components/SimpleSection'

export default function OnRampsPage() {
  return (
    <Layout className='gap-6'>
      <h1 className='w-full text-5xl'>Web 2.5 On-Ramps</h1>
      <hr className='w-full border-pt-purple-300' />
      <div className='w-full grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2'>
        <SimpleSection
          title={`What's the idea?`}
          content={
            <>
              <p>
                One of the biggest challenges users face in using DeFi protocols like PoolTogether
                is the onboarding phase of wallet management and funding. Tools like
                smart/abstracted wallets and simple fiat-to-crypto on-ramps can alleviate some of
                this friction.
              </p>
              <p>
                We welcome any builders to build new front-ends that abstract out these challenges
                to new PoolTogether users. We can provide you with tooling and help through our many
                social channels, as well as funding if necessary. Come chat with us!
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
                <ResourceLink href='https://github.com/GenerationSoftware/pooltogether-sveltekit-template'>
                  SvelteKit App Template
                </ResourceLink>
                <ResourceLink href='https://github.com/GenerationSoftware/pooltogether-nextjs-template'>
                  NextJS App Template
                </ResourceLink>
                <ResourceLink href='https://www.npmjs.com/package/@generationsoftware/hyperstructure-client-js'>
                  PoolTogether Client SDK
                </ResourceLink>
                <ResourceLink href='https://www.npmjs.com/package/@generationsoftware/hyperstructure-react-hooks'>
                  PoolTogether React Hooks
                </ResourceLink>
              </div>
            }
          />
        </div>
      </div>
    </Layout>
  )
}
