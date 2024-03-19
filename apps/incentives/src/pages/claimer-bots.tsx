import { Layout } from '@components/Layout'
import { ResourceLink } from '@components/ResourceLink'
import { SimpleSection } from '@components/SimpleSection'

export default function ClaimerBotsPage() {
  return (
    <Layout className='gap-6'>
      <h1 className='w-full text-5xl'>Prize Claimer Bot Incentives</h1>
      <hr className='w-full border-pt-purple-300' />
      <div className='w-full grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2'>
        <SimpleSection
          title='What needs to be done?'
          content={
            <>
              <p>
                Prize claimer bots earn fees by claiming prizes for winners during every draw. These
                winners must be computed using the random number from each draw, and then can be
                claimed.
              </p>
              <p>
                The fees on each prize claim is priced via a variable rate gradual dutch auction
                (VRGDA).
              </p>
            </>
          }
        />
        <SimpleSection
          title='What is the incentive?'
          content={
            <div className='flex flex-col'>
              <span>Bot runners compete for</span>
              <span className='text-5xl'>up to $150/mo*</span>
              <span className='text-pt-purple-300'>*approximation based on current yield</span>
            </div>
          }
        />
        <SimpleSection
          title='Resources'
          content={
            <div className='flex flex-col gap-4 items-start'>
              <ResourceLink href='https://dev.pooltogether.com/protocol/design/prize-claimer'>
                Dev Docs: Prize Claimer Design
              </ResourceLink>
              <ResourceLink href='https://dev.pooltogether.com/protocol/guides/claiming-prizes'>
                Dev Docs: Claiming Prizes Guide
              </ResourceLink>
              <ResourceLink href='https://mirror.xyz/0x49ca801A80e31B1ef929eAB13Ab3FBbAe7A55e8F/xPSEh1pfjV2IT1yswcsjN2gBBrVf548V8q9W23xxA8U'>
                Tutorial: Building a prize claiming bot
              </ResourceLink>
              <ResourceLink href='https://github.com/GenerationSoftware/pt-v5-autotasks-monorepo'>
                Example: G9 Bots Monorepo
              </ResourceLink>
              <ResourceLink href='https://github.com/underethsea/pooltogether-v5-node'>
                Example: PoolTime Bots Monorepo
              </ResourceLink>
              <ResourceLink href='https://analytics.cabana.fi/prizes'>
                Analytics: Prize Claims (Cabanalytics)
              </ResourceLink>
              <ResourceLink href='https://pooltime.app/prizes'>
                Analytics: Prize Claims (PoolTime)
              </ResourceLink>
              <ResourceLink href='https://github.com/GenerationSoftware/foundry-winner-calc'>
                Tooling: G9 Foundry Winner Calculator
              </ResourceLink>
            </div>
          }
        />
      </div>
    </Layout>
  )
}
