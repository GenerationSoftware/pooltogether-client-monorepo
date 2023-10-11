import { PrizePoolBadge } from '@shared/react-components'
import { NETWORK } from '@shared/utilities'
import { Faq } from '@components/Faq'
import { GrandPrize } from '@components/GrandPrize'
import { Header } from '@components/Header'
import { Layout } from '@components/Layout'
import { RecentWinners } from '@components/RecentWinners'
import { VaultCards } from '@components/VaultCards'

export default function HomePage() {
  const chainId = NETWORK['optimism-goerli']

  return (
    <Layout>
      <Header />
      <PrizePoolBadge chainId={chainId} className='mt-8' />
      <GrandPrize chainId={chainId} className='mt-6' />
      <VaultCards chainId={chainId} className='mt-8' />
      <RecentWinners chainId={chainId} className='mt-12' />
      <Faq className='mt-12' />
    </Layout>
  )
}
