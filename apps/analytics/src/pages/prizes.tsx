import { NETWORK } from '@shared/utilities'
import { PrizesView } from 'src/views/PrizesView'
import { Layout } from '@components/Layout'

export default function PrizesPage() {
  return (
    <Layout>
      <PrizesView chainId={NETWORK.optimism} className='mt-32' />
    </Layout>
  )
}
