import { HomeContent } from '@components/Home/HomeContent'
import { HomeHeader } from '@components/Home/HomeHeader'
import { Layout } from '@components/Layout'

export default function HomePage() {
  return (
    <Layout>
      <HomeHeader className='mt-10' />
      <HomeContent className='pt-64 pb-[30rem]' />
    </Layout>
  )
}
