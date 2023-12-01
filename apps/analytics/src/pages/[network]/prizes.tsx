import { Spinner } from '@shared/ui'
import { PrizesView } from 'src/views/PrizesView'
import { Layout } from '@components/Layout'
import { useSelectedChainId } from '@hooks/useSelectedChainId'

export default function PrizesPage() {
  const { chainId, isReady } = useSelectedChainId()

  return (
    <Layout>
      {!isReady && <Spinner />}
      {/* TODO: show some error message if invalid chainId */}
      {isReady && (!!chainId ? <PrizesView chainId={chainId} /> : <></>)}
    </Layout>
  )
}
