import classNames from 'classnames'
import { ReactNode } from 'react'
import { Layout } from '@components/Layout'
import { ResourceLink } from '@components/ResourceLink'

export default function YieldBotsPage() {
  return (
    <Layout className='gap-6'>
      <h1 className='w-full text-5xl'>Yield Liquidation Bot Incentives</h1>
      <hr className='w-full border-pt-purple-300' />
      <div className='w-full grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2'>
        <Section
          title='What needs to be done?'
          content={
            <>
              <p>
                Yield liquidation bots use PoolTogether's liquidation contracts to swap yield for
                the prize pool's prize token, and make them available to be won by users.
              </p>
              <p>
                The reward for liquidating yield is the arbitrage on that swap, created via a
                variable rate gradual dutch auction (VRGDA).
              </p>
            </>
          }
        />
        <Section
          title='What is the incentive?'
          content={
            <div className='flex flex-col'>
              <span>Bot runners compete for</span>
              <span className='text-5xl'>up to $200/mo*</span>
              <span className='text-pt-purple-300'>*approximation based on current yield</span>
            </div>
          }
        />
        <Section
          title='Resources'
          content={
            <div className='flex flex-col gap-4 items-start'>
              <ResourceLink href='https://dev.pooltogether.com/protocol/guides/liquidating-yield'>
                Dev Docs: Liquidating Yield Guide
              </ResourceLink>
              <ResourceLink href='https://mirror.xyz/0x49ca801A80e31B1ef929eAB13Ab3FBbAe7A55e8F/ES-IJduktYPb0X_sBikfqL-PVFRweNpoPrlr01zcVX8'>
                Tutorial: Building a yield liquidating bot
              </ResourceLink>
              <ResourceLink href='https://github.com/GenerationSoftware/pt-v5-autotasks-monorepo'>
                Example: G9 Bots Monorepo
              </ResourceLink>
              <ResourceLink href='https://github.com/underethsea/pooltogether-v5-node'>
                Example: PoolTime Bots Monorepo
              </ResourceLink>
              <ResourceLink href='https://analytics.cabana.fi/liquidations'>
                Analytics: Liquidations (Cabanalytics)
              </ResourceLink>
              <ResourceLink href='https://pooltime.app/contributions'>
                Analytics: Liquidations (PoolTime)
              </ResourceLink>
              <ResourceLink href='https://flash.cabana.fi/'>
                Interface: Flash Liquidations
              </ResourceLink>
            </div>
          }
        />
      </div>
    </Layout>
  )
}

interface SectionProps {
  title: string
  content: ReactNode
  className?: string
}

const Section = (props: SectionProps) => {
  const { title, content, className } = props

  return (
    <section className={classNames('flex flex-col gap-2 text-xl', className)}>
      <span className='text-pt-purple-300 font-semibold'>{title}</span>
      {content}
    </section>
  )
}
