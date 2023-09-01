import { ExternalLink, LINKS } from '@shared/ui'
import { SECONDS_PER_DAY } from '@shared/utilities'
import { GetStaticProps } from 'next'
import { useTranslations } from 'next-intl'
import { getMessages } from 'src/utils'
import { CheckPrizesBanner } from '@components/Account/CheckPrizesBanner'
import { Layout } from '@components/Layout'
import { PrizePoolDisplay } from '@components/Prizes/PrizePoolDisplay'
import { PrizePoolWinners } from '@components/Prizes/PrizePoolWinners'

interface PrizesPageProps {
  messages: IntlMessages
}

export const getStaticProps: GetStaticProps<PrizesPageProps> = async ({ locale }) => {
  const messages = await getMessages(locale, { useDefault: true })

  return {
    props: { messages },
    revalidate: SECONDS_PER_DAY
  }
}

export default function PrizesPage() {
  const t = useTranslations('Prizes')

  return (
    <Layout className='gap-8'>
      <CheckPrizesBanner />
      <span className='hidden text-6xl py-2 md:block'>🏆</span>
      <PrizePoolDisplay />
      {/* TODO: add more specific docs link once available */}
      <ExternalLink
        href={`${LINKS.docs}/protocol/what-makes-pooltogether-v5-different`}
        size='xs'
        className='text-pt-purple-300 md:text-base'
        iconClassName='md:h-5 md:w-5'
      >
        {t('learnMore')}
      </ExternalLink>
      <PrizePoolWinners />
    </Layout>
  )
}
