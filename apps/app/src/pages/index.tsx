import { Button } from '@shared/ui'
import Link from 'next/link'
import { Layout } from '@components/Layout'
import { LargestPrizeHeader } from '@components/Prizes/LargestPrizeHeader'
import { PrizePoolCards } from '@components/Prizes/PrizePoolCards'

export default function HomePage() {
  return (
    <Layout className='gap-8'>
      <LargestPrizeHeader />
      <Link href='/vaults' passHref={true}>
        <Button>Deposit to Win</Button>
      </Link>
      <PrizePoolCards />
    </Layout>
  )
}
