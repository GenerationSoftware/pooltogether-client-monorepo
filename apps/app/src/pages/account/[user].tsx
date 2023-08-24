import { SECONDS_PER_DAY } from '@shared/utilities'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { getMessages } from 'src/utils'
import { ExternalAccountPageContent } from '@components/Account/ExternalAccountPageContent'
import { Layout } from '@components/Layout'

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

interface ExternalAccountPageProps {
  messages: IntlMessages
}

export const getStaticProps: GetStaticProps<ExternalAccountPageProps> = async ({ locale }) => {
  const messages = await getMessages(locale, { useDefault: true })

  return {
    props: { messages },
    revalidate: SECONDS_PER_DAY
  }
}

export default function ExternalAccountPage() {
  const router = useRouter()

  if (router.isReady) {
    return (
      <Layout className='gap-6 lg:gap-8'>
        <ExternalAccountPageContent queryParams={router.query} />
      </Layout>
    )
  }
}
