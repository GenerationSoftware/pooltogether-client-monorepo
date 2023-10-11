import { NETWORK } from '@shared/utilities'
import { DrawsView } from 'src/views/DrawsView'
import { Layout } from '@components/Layout'

export default function DrawsPage() {
  return (
    <Layout>
      <DrawsView chainId={NETWORK['optimism-goerli']} />
    </Layout>
  )
}
