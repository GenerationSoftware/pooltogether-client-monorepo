import { CreatePageContent } from '@components/CreatePageContent'
import { Layout } from '@components/Layout'

export default function CreatePage() {
  return (
    <Layout isSidebarActive={true}>
      <CreatePageContent />
    </Layout>
  )
}
