import { IncentivesPageContent } from '@components/IncentivesPageContent'
import { Layout } from '@components/Layout'

export default function YieldBotsPage() {
  return (
    <Layout className='gap-6'>
      <IncentivesPageContent
        title='Yield Liquidation Bot Incentives'
        actions={
          <>
            <p>
              Yield liquidation bots use PoolTogether's liquidation contracts to swap yield for the
              prize pool's prize token, and make them available to be won by users.
            </p>
            <p>
              The reward for liquidating yield is the arbitrage on that swap, created via a variable
              rate gradual dutch auction (VRGDA).
            </p>
          </>
        }
        incentive={
          <div className='flex flex-col'>
            <span>Bot runners compete for</span>
            <span className='text-5xl'>up to $200/mo*</span>
            <span className='text-pt-purple-300'>*approximation based on current yield</span>
          </div>
        }
        resources={[
          {
            name: 'Dev Docs: Liquidating Yield Guide',
            href: 'https://dev.pooltogether.com/protocol/guides/liquidating-yield'
          },
          {
            name: 'Tutorial: Building a yield liquidating bot',
            href: 'https://mirror.xyz/0x49ca801A80e31B1ef929eAB13Ab3FBbAe7A55e8F/ES-IJduktYPb0X_sBikfqL-PVFRweNpoPrlr01zcVX8'
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
            name: 'Analytics: Liquidations (Cabanalytics)',
            href: 'https://analytics.cabana.fi/liquidations'
          },
          {
            name: 'Analytics: Liquidations (PoolTime)',
            href: 'https://pooltime.app/contributions'
          },
          {
            name: 'Interface: Flash Liquidations',
            href: 'https://flash.cabana.fi/'
          }
        ]}
      />
    </Layout>
  )
}
