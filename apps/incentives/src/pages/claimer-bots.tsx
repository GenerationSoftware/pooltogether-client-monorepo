import { IncentivesPageContent } from '@components/IncentivesPageContent'
import { Layout } from '@components/Layout'

export default function ClaimerBotsPage() {
  return (
    <Layout className='gap-6'>
      <IncentivesPageContent
        title='Prize Claimer Bot Incentives'
        actions={
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
        incentive={
          <div className='flex flex-col'>
            <span>Bot runners compete for</span>
            <span className='text-5xl'>up to $150/mo*</span>
            <span className='text-pt-purple-300'>*approximation based on current yield</span>
          </div>
        }
        resources={[
          {
            name: 'Dev Docs: Prize Claimer Design',
            href: 'https://dev.pooltogether.com/protocol/design/prize-claimer'
          },
          {
            name: 'Dev Docs: Claiming Prizes Guide',
            href: 'https://dev.pooltogether.com/protocol/guides/claiming-prizes'
          },
          {
            name: 'Tutorial: Building a prize claiming bot',
            href: 'https://mirror.xyz/0x49ca801A80e31B1ef929eAB13Ab3FBbAe7A55e8F/xPSEh1pfjV2IT1yswcsjN2gBBrVf548V8q9W23xxA8U'
          },
          {
            name: 'Example: G9 Bots Monorepo',
            href: 'https://github.com/GenerationSoftware/pt-v5-autotasks-monorepo'
          },
          {
            name: 'Example: PoolTime Bots Monorepo',
            href: 'https://github.com/underethsea/pooltogether-v5-node'
          },
          {
            name: 'Analytics: Prize Claims (Cabanalytics)',
            href: 'https://analytics.cabana.fi/prizes'
          },
          {
            name: 'Analytics: Prize Claims (PoolTime)',
            href: 'https://pooltime.app/prizes'
          },
          {
            name: 'Tooling: G9 Foundry Winner Calculator',
            href: 'https://github.com/GenerationSoftware/foundry-winner-calc'
          }
        ]}
      />
    </Layout>
  )
}
