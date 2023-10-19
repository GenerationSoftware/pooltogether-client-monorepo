import { NETWORK } from '@shared/utilities'
import { LiquidationsView } from 'src/views/LiquidationsView'
import { Layout } from '@components/Layout'

export default function LiquidationsPage() {
  return (
    <Layout>
      <LiquidationsView chainId={NETWORK.optimism} />
    </Layout>
  )
}
