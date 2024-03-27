import { PrizePoolBadge } from '@shared/react-components'
import { NETWORK, PRIZE_POOLS } from '@shared/utilities'
import { Faq } from '@components/Faq'
import { GrandPrize } from '@components/GrandPrize'
import { Header } from '@components/Header'
import { Layout } from '@components/Layout'
import { RecentWinners } from '@components/RecentWinners'
import { VaultCards } from '@components/VaultCards'

export default function HomePage() {
  const chainId = NETWORK.optimism

  const isValidChainId = !!PRIZE_POOLS.find((prizePool) => prizePool.chainId === chainId)

  return (
    <Layout>
      <Header className='max-w-2xl' />
      {isValidChainId && (
        <>
          <PrizePoolBadge chainId={chainId} className='mt-8' />
          <GrandPrize chainId={chainId} className='mt-6' />
          <VaultCards chainId={chainId} className='mt-8' />
          <RecentWinners chainId={chainId} className='mt-12' />
        </>
      )}
      <Faq className='mt-12' />
    </Layout>
  )
}
