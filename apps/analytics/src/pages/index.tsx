import { NETWORK } from '@shared/utilities'
import { DrawCards } from '@components/Draws/DrawCards'
import { Layout } from '@components/Layout'

export default function DrawsPage() {
  return (
    <Layout>
      <DrawCards chainId={NETWORK.optimism} />
    </Layout>
  )
}
