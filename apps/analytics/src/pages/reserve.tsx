import { NETWORK } from '@shared/utilities'
import { ReserveView } from 'src/views/ReserveView'
import { Layout } from '@components/Layout'

export default function ReservePage() {
  return (
    <Layout>
      <ReserveView chainId={NETWORK.optimism} />
    </Layout>
  )
}
