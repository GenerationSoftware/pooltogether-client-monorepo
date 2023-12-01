import { Spinner } from '@shared/ui'
import { DrawsView } from 'src/views/DrawsView'
import { Layout } from '@components/Layout'
import { useSelectedChainId } from '@hooks/useSelectedChainId'

export default function DrawsPage() {
  const { chainId, isReady } = useSelectedChainId()

  return (
    <Layout>
      {!isReady && <Spinner />}
      {/* TODO: show some error message if invalid chainId */}
      {isReady && (!!chainId ? <DrawsView chainId={chainId} /> : <></>)}
    </Layout>
  )
}
