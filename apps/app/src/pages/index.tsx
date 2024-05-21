import { Button } from '@shared/ui'
import { LINKS, SECONDS_PER_DAY } from '@shared/utilities'
import classNames from 'classnames'
import { GetStaticProps } from 'next'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
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
      <Link href='/vaults' passHref={true}>
        <Button>{t('depositToWin')}</Button>
      </Link>
      <PrizePoolCards />
      <CabanaPoweredBy />
    </Layout>
  )
}

const CabanaPoweredBy = (props: { className?: string }) => {
  const { className } = props

  const t = useTranslations('Common')

  return (
    <div className={classNames('flex gap-2 items-center', className)}>
      {t('cabanaPoweredBy')}
      <Link href={LINKS.protocolLandingPage} target='_blank'>
        <Image
          src='/pooltogether-logo.svg'
          alt='PoolTogether Logo'
          width={183}
          height={72}
          className='w-24 h-auto'
        />
      </Link>
    </div>
  )
}
