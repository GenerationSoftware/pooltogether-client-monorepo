import { SECONDS_PER_DAY } from '@shared/utilities'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { getMessages } from 'src/utils'
import { Layout } from '@components/Layout'
import { VaultPageContent } from '@components/Vault/VaultPageContent'

interface VaultPageProps {
  messages: IntlMessages
}

export const getStaticProps: GetStaticProps<VaultPageProps> = async ({ locale }) => {
  const messages = await getMessages(locale, { useDefault: true })

  return {
    props: { messages },
    revalidate: SECONDS_PER_DAY
  }
}

// TODO: display notice that external vaults aren't in the selected vaultlists somewhere on the page
export default function VaultPage() {
  const router = useRouter()

  if (router.isReady) {
    return (
      <Layout className='gap-12'>
        <VaultPageContent queryParams={router.query} />
      </Layout>
    )
  }
}
