import { NETWORK } from '@shared/utilities'
import { Layout } from '@components/Layout'
import { ReserveInfo } from '@components/Reserve/ReserveInfo'

export default function ReservePage() {
  return (
    <Layout>
      <ReserveInfo chainId={NETWORK.optimism} className='mt-32' />
    </Layout>
  )
}
