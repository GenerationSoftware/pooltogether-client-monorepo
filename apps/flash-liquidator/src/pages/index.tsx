import { Header } from '@components/Header'
import { Layout } from '@components/Layout'
import { LiquidationsTable } from '@components/LiquidationsTable'

export default function HomePage() {
  return (
    <Layout>
      <div className='w-full max-w-[1440px] flex flex-col grow gap-5 items-center justify-center px-4 lg:px-0'>
        <Header className='max-w-4xl' />
        <LiquidationsTable className=' w-full' />
      </div>
    </Layout>
  )
}
