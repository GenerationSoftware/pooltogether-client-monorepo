import { Spinner } from '@shared/ui'
import { ReserveView } from 'src/views/ReserveView'
import { Layout } from '@components/Layout'
import { useSelectedChainId } from '@hooks/useSelectedChainId'

export default function ReservePage() {
  const { chainId, isReady } = useSelectedChainId()

  return (
    <Layout>
      {!isReady && <Spinner />}
      {/* TODO: show some error message if invalid chainId */}
      {isReady && (!!chainId ? <ReserveView chainId={chainId} /> : <></>)}
    </Layout>
  )
}
