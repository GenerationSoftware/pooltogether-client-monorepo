import { Layout } from '@components/Layout'
import { PageNotFound } from '@components/PageNotFound'

export default function Custom404Page() {
  return (
    <Layout className='!mb-0'>
      <PageNotFound className='grow' />
    </Layout>
  )
}
