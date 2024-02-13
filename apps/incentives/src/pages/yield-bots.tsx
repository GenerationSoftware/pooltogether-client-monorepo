import classNames from 'classnames'
import { ReactNode } from 'react'
import { Layout } from '@components/Layout'

// TODO: add content
// TODO: fix scaling on mobile/desktop
export default function YieldBotsPage() {
  return (
    <Layout className='gap-6'>
      <h1 className='w-full text-5xl'>Yield Liquidation Bot Incentives</h1>
      <hr className='w-full border-pt-purple-300' />
      <div className='w-full flex gap-x-4 gap-y-6 flex-wrap'>
        <Section title='What needs to be done?' content={'TODO'} />
        <Section title='What is the incentive?' content={'TODO'} />
        <Section title='Resources' content={'TODO'} />
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
