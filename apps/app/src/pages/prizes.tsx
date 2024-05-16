import { ExternalLink } from '@shared/ui'
import { LINKS, SECONDS_PER_DAY } from '@shared/utilities'
import { GetStaticProps } from 'next'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { getMessages } from 'src/utils'
import { CheckPrizesBanner } from '@components/Account/CheckPrizesBanner'
import { Layout } from '@components/Layout'
import { PrizePoolDisplay } from '@components/Prizes/PrizePoolDisplay'
import { PrizePoolWinners } from '@components/Prizes/PrizePoolWinners'

interface PrizesPageProps {
  messages: IntlMessages
}

export const getStaticProps: GetStaticProps<PrizesPageProps> = async ({ locale }) => {
  const messages = await getMessages(locale)

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
      <Image
        src='/partyEmoji.svg'
        alt='Cabana Party Emoji'
        width={380}
        height={380}
        priority={true}
        className='hidden w-auto h-24 md:block'
      />
      <PrizePoolDisplay />
      <ExternalLink
        href={LINKS.protocolBasicsDocs}
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
