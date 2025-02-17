import { Button } from '@shared/ui'
import { SECONDS_PER_DAY } from '@shared/utilities'
import { GetStaticProps } from 'next'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'
import { getMessages } from 'src/utils'
import { CheckPrizesBanner } from '@components/Account/CheckPrizesBanner'
import { Layout } from '@components/Layout'
import { PrizePoolDisplay } from '@components/Prizes/PrizePoolDisplay'
import { PrizePoolWinners } from '@components/Prizes/PrizePoolWinners'
import { PrizesHeader } from '@components/Prizes/PrizesHeader'

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
  const t = useTranslations('Common')

  const [network, setNetwork] = useState<number | undefined>(undefined)

  return (
    <Layout className='gap-8'>
      <CheckPrizesBanner />
      <PrizesHeader />
      <Link href={`/vaults${!!network ? `?network=${network}` : ''}`} passHref={true}>
        <Button>{t('depositToWin')}</Button>
      </Link>
      <PrizePoolDisplay onNetworkChange={setNetwork} className='mt-8' />
      {/* TODO: enable once data can be more efficiently fetched */}
      {/* <PrizePoolWinners className='mt-8' /> */}
    </Layout>
  )
}
