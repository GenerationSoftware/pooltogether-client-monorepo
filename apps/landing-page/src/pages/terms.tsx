import { Layout } from '@components/Layout'
import { TermsOfService } from '@components/TermsOfService'

export default function TermsPage() {
  return (
    <Layout className='px-6'>
      <TermsOfService className='max-w-7xl' />
    </Layout>
  )
}
