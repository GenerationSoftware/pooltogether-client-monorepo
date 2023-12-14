import { Layout } from '@components/Layout'
import { PrivacyPolicy } from '@components/PrivacyPolicy'

export default function PrivacyPage() {
  return (
    <Layout className='px-6'>
      <PrivacyPolicy className='max-w-7xl' />
    </Layout>
  )
}
