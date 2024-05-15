import { SECONDS_PER_DAY } from '@shared/utilities'
import { GetStaticProps } from 'next'
import { useTranslations } from 'next-intl'
import { getMessages } from 'src/utils'
import { Layout } from '@components/Layout'
import { LargestPrizeHeader } from '@components/Prizes/LargestPrizeHeader'
import { PrizePoolCards } from '@components/Prizes/PrizePoolCards'

interface HomePageProps {
  messages: IntlMessages
}

export const getStaticProps: GetStaticProps<HomePageProps> = async ({ locale }) => {
  const messages = await getMessages(locale)

  return {
    props: { messages },
    revalidate: SECONDS_PER_DAY
  }
}

export default function HomePage() {
  const t = useTranslations('Common')

  return (
    <Layout className='gap-8'>
      <LargestPrizeHeader />
      <PrizePoolCards />
    </Layout>
  )
}
