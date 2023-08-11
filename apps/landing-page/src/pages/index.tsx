import { HomeContent } from '@components/HomeContent'
import { HomeHeader } from '@components/HomeHeader'
import { Layout } from '@components/Layout'

export default function HomePage() {
  return (
    <Layout>
      <HomeHeader className='mt-10' />
      <HomeContent className='pt-56 pb-64' />
    </Layout>
  )
}
