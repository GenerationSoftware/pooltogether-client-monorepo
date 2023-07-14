import { SECONDS_PER_DAY } from '@shared/utilities'
import { GetStaticProps } from 'next'
import { getMessages } from 'src/utils'
import { Layout } from '@components/Layout'
import { PageNotFound } from '@components/PageNotFound'

interface Custom404PageProps {
  messages: IntlMessages
}

export const getStaticProps: GetStaticProps<Custom404PageProps> = async ({ locale }) => {
  const messages = await getMessages(locale, { useDefault: true })

  return {
    props: { messages },
    revalidate: SECONDS_PER_DAY
  }
}

export default function Custom404Page() {
  return (
    <Layout className='!mb-0'>
      <PageNotFound className='grow' />
    </Layout>
  )
}
