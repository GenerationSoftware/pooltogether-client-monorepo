import { NETWORK } from '@shared/utilities'
import { BurnView } from 'src/views/BurnView'
import { Layout } from '@components/Layout'

export default function BurnPage() {
  return (
    <Layout>
      <BurnView chainId={NETWORK.optimism} />
    </Layout>
  )
}
