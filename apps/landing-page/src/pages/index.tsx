import { HomeContent } from '@components/Home/HomeContent'
import { HomeHeader } from '@components/Home/HomeHeader'
import { Layout } from '@components/Layout'

export default function HomePage() {
  return (
    <Layout>
      <HomeHeader className='mt-10' />
      <HomeContent className='py-12' />
    </Layout>
  )
}
