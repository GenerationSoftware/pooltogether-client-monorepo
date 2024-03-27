import { IncentivesPageContent } from '@components/IncentivesPageContent'
import { Layout } from '@components/Layout'

export default function DrawBotsPage() {
  return (
    <Layout className='gap-6'>
      <IncentivesPageContent
        title='Draw Auction Bot Incentives'
        actions={
          <>
            <p>
              Every draw a random number must be generated and supplied to the prize pool so that
              prizes may be awarded.
            </p>
            <p>
              The reward for doing so is a percentage of the prize pool's reserve. This percentage
              climbs non-linearly throughout the span of a draw auction period after it is closed.
            </p>
          </>
        }
        incentive={
          <div className='flex flex-col'>
            <span>Bot runners compete for</span>
            <span className='text-5xl'>up to $50/mo*</span>
            <span className='text-pt-purple-300'>
              *approximation based on current bot(s) performance
            </span>
          </div>
        }
        resources={[
          {
            name: 'Dev Docs: Draw Auction Design',
            href: 'https://dev.pooltogether.com/protocol/design/draw-auction'
          },
          {
            name: 'Dev Docs: Completing Draw Auctions Guide',
            href: 'https://dev.pooltogether.com/protocol/guides/completing-draw-auctions'
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
            name: 'Analytics: Draws (Cabanalytics)',
            href: 'https://analytics.cabana.fi'
          },
          {
            name: 'Analytics: Draws (PoolTime)',
            href: 'https://pooltime.app/draws'
          }
        ]}
      />
    </Layout>
  )
}
